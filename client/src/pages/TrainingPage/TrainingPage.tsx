import React, { useEffect, useRef, useState } from "react";
import Modal from '../../components/Modal/Modal'

import { useNavigate, useLocation } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "@/hooks/useTrackerSettings";

import { GazeFeatures } from "@/tracker/FaceControls/FaceControls";
import { generateFullTrajectory, getGridPoints, IPoint } from "./TraningData";

// Длительность ожидания перед запуском движения маркера во втором этапе (в миллисекундах)
const WAIT_BEFORE_MOVE_MS = 5000;

const STATIC_MARKERS: IPoint[] = getGridPoints(4, 4)
const TRAJECTORY_DURATION_MS = 240000;

const MOUSE_POLL_FPS = 10; // Какое-то значение, раз в секунду можно задать, например, 10

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Откуда пришли (если нет, по умолчанию '/')
  const fromPath = (location.state as any)?.from || '/';
  
  // Состояния:
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [showStageModal, setShowStageModal] = useState(true);

  // В stage === 1 мы показываем статические маркеры;
  // при клике на каждый маркер он исчезает и пишем данные.
  const [trainingData, setTrainingData] = useState<
    Array<{ gazeFeatures: GazeFeatures; target: {x: number, y:number} }>
  >([]);

  // В stage === 2 мы показываем один маркер, который после 5 секунд начнёт двигаться.
  const [dynamicData, setDynamicData] = useState<
    Array<{ gazeFeatures: GazeFeatures; target: {x: number, y:number} }>
  >([]);

  const [additionalData, setAdditionalData] = useState<
    Array<{ gazeFeatures: GazeFeatures; target: { x: number; y: number } }>
  >([]);
  
  // Флаг, что динамический маркер уже начал движение (после таймера)
  const [dynamicMoving, setDynamicMoving] = useState(false);


  const [staticMarkersCoordinates, setStaticMarkersCoordinates] = useState<
      { x: number; y: number; clicked: boolean }[]>(() =>
      STATIC_MARKERS.map((marker) => ({
        x: marker.x,
        y: marker.y,
        clicked: false,
      }))
    );

  const TRAJECTORY_POINTS = React.useMemo<IPoint[]>(() => {
    return generateFullTrajectory();
  }, []);

  // Текущие координаты движущегося маркера
  const [dynamicMarkerPos, setDynamicMarkerPos] = useState<IPoint>({
    x: TRAJECTORY_POINTS[0].x,
    y: TRAJECTORY_POINTS[0].y,
  });

  const [disableConfirm, setDisableConfirm] = useState(true);

  // useRef для хранения времени старта траектории
  const trajectoryStartRef = useRef<number>(0);
  
  // Таймеры
  const moveTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Состояния для дополнительного этапа
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);
  const pollIntervalRef = useRef<number | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    window.faceControls.stop()
    window.faceControls
      .init('faceContainer', '/landmarker', '/landmarker/face_landmarker.task')
      .then(async () => {
        window.faceControls.startCamera().then(()=>{
        // Обрабатываем первый кадр без каких либо координат из-за того, что почему-то первый кадр обрабатывается дольше последующих
          window.faceControls.getGazeFeatures().then(()=>{
            setDisableConfirm(false)
          })
        });
      })

    return () => {
        window.faceControls.stopCamera();
    };
  }, []);


  // --------------- Этап 1: Работа со статическими маркерами ---------------
  // Показываем Modal («правила сбора этап 1»). После нажатия ok → отображаем маркеры.

  const handleStage1Confirm = () => {
    setShowStageModal(false);
  };

  const handleStaticMarkerClick = async (idx: number) => {
    const gazeFeatures = await window.faceControls.getGazeFeatures()
    if (!gazeFeatures){
      return
    }

    const target = {x: staticMarkersCoordinates[idx].x, y: staticMarkersCoordinates[idx].y}
    staticMarkersCoordinates[idx].clicked = true

    setStaticMarkersCoordinates((prev) =>
      prev.map((m, i) =>
        i === idx
          ? { x: m.x, y: m.y, clicked: true }
          : m
      )
    );

    setTrainingData((prev) => [...prev, { gazeFeatures, target }]);
  };

  // Если все маркеры кликнуты → переход к этапу 2
  useEffect(() => {
    for (let i = 0; i < staticMarkersCoordinates.length; i++) {
      if (!staticMarkersCoordinates[i].clicked){
        return
      }
    }

    setStage(2);
    setShowStageModal(true);
  }, [staticMarkersCoordinates]);

  // --------------- Этап 2: Динамический маркер ---------------
  // Когда пользователь закрывает второе модальное окно → показываем только белый фон и один маркер в начальной точке.
  // Через 5 секунд включаем движение, стартуем анимацию и запись данных.

  const handleStage2Confirm = () => {
    setShowStageModal(false);
    
    // обработка первого кадра. 
    // требуется из-за того, что faceControls обрабатывает первый кадр дольше, чем последующие  
    window.faceControls.getGazeFeatures()
    
    // Запускаем таймер: через 5 сек marker начинает двигаться
    moveTimeoutRef.current = window.setTimeout(() => {
      setDynamicMoving(true);
      trajectoryStartRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animateTrajectory); // исправление
    }, WAIT_BEFORE_MOVE_MS);
  };

  let frameCount = 0;
  const animateTrajectory = (timestamp: number) => {
    frameCount++  

    const start = trajectoryStartRef.current;
    let elapsed = timestamp - start; // в мс
    if (elapsed < 0) elapsed = 0;

    const totalDuration = TRAJECTORY_DURATION_MS;
    const segmentCount = TRAJECTORY_POINTS.length - 1;
    const segmentDuration = totalDuration / segmentCount;
    const currentSegment = Math.min(
      Math.floor(elapsed / segmentDuration),
      segmentCount - 1
    );

    const localT = (elapsed % segmentDuration) / segmentDuration;
    const p0 = TRAJECTORY_POINTS[currentSegment];
    const p1 = TRAJECTORY_POINTS[currentSegment + 1];
    const x = p0.x + (p1.x - p0.x) * localT;
    const y = p0.y + (p1.y - p0.y) * localT;

    setDynamicMarkerPos({ x, y });

    if (frameCount %8 == 0){
      window.faceControls.getGazeFeatures()
      .then((gazeFeatures) =>{
        if (gazeFeatures){
          const target = {x, y};
          setDynamicData((prev) => [...prev, { gazeFeatures, target }]);
        }
      })
      .catch((console.error))
    } 

    if (elapsed < totalDuration) {
      // продолжаем анимацию
      animationFrameRef.current = window.requestAnimationFrame(animateTrajectory);
    } else {
      setDynamicMoving(false);
    }
  };

    useEffect(() => {
      if (!dynamicMoving && stage === 2 && !showStageModal) {
        setStage(3)
        setShowStageModal(true)
      }
    }, [dynamicMoving]);

  // --------------- Этап 3: Тренировка модели ---------------
  const trainRegressionModel = () => {
    let allData = [...trainingData, ...dynamicData, ...additionalData];
    // for (let i = 0; i < superData.length; i++){
    //   allData = [...allData, ...superData[i]] 
    // }

    if (allData.length === 0) {
      console.warn("Нет данных для обучения!");
      return;
    }
    console.log("allData", allData)

    const gazesFeatures: GazeFeatures[] = []
    const screenCoordinates: {x:number, y:number}[] = []
    for (let i = 0; i < allData.length; i++) {
      const data = allData[i];
      gazesFeatures.push(data.gazeFeatures)
      screenCoordinates.push({
        x: data.target.x,
        y: data.target.y
      })
    }
    
    window.faceControls.learnRegressionModel(gazesFeatures, screenCoordinates)

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.isTrained = true;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn('Не удалось записать isTrained в localStorage');
    }
  };

  const handleStage3Exit = () => {
    trainRegressionModel()
    navigate(fromPath);
  };

  const handleProceedAdditional = () => {
    setShowStageModal(false);
    setStage(4);
  };

  // --------------- Этап 4: Дополнительное обучение ---------------

  // Обработчики для мыши и клавиатуры
  useEffect(() => {
    if (stage !== 4) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        // Переключаем трекинг
        setIsTracking((prev) => !prev);
      }
      if (e.key === "Escape") {
        // Показываем окно выхода
        setShowExitModal(!showExitModal);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stage]);

  // Интервал для поллинга faceControls
  useEffect(() => {
    if (stage !== 4) return;

    // Если нужно остановить предыдущий интервал
    if (pollIntervalRef.current !== null) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    if (isTracking) {
      const intervalMs = 1000 / MOUSE_POLL_FPS;
      pollIntervalRef.current = window.setInterval(() => {
        window.faceControls
          .getGazeFeatures()
          .then((gazeFeatures) => {
            if (gazeFeatures) {
              setAdditionalData((prev) => [
                ...prev,
                { gazeFeatures, target: { ...mousePos } },
              ]);
            }
          })
          .catch(console.error);
      }, intervalMs);
    }

    return () => {
      if (pollIntervalRef.current !== null) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isTracking, mousePos, stage]);

  // Хендлер подтверждения выхода из дополнительного этапа
  const handleConfirmExitAdditional = () => {
    trainRegressionModel()
    navigate(fromPath);
  };

  // Хендлер отмены выхода из дополнительного этапа
  const handleCancelExitAdditional = () => {
    setShowExitModal(false);
  };


  // При размонтировании очищаем таймеры/анимацию
  useEffect(() => {
    return () => {
      if (moveTimeoutRef.current !== null) {
        clearTimeout(moveTimeoutRef.current);
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (pollIntervalRef.current !== null) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // --------------- Рендер ---------------
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: stage === 2 && !showStageModal ? "#fff" : undefined }}>
      {/* 1. Если мы на этапе 1 и modal открыт → показываем этап1-инструкцию */}
      {stage === 1 && showStageModal && (
        <Modal
          title="Этап 1: Сбор статических точек"
          text="Вам будут показаны несколько маркеров. Необходимо смотря на маркеры кликнуть на каждый из них. Нажмите 'ОК', чтобы начать."
          onConfirm={handleStage1Confirm}
          onCancel={() => {
            // Если пользователь отменил на этом этапе, возвращаемся назад
            navigate(fromPath);
          }}
          confirmText="ОК"
          cancelText="Отмена"
          confirmDisabled={disableConfirm}
        />
      )}

      {/* 2. Если мы на этапе 1, modal закрыт → рисуем статические маркеры, пока пользователь не кликнул на все */}
      {stage === 1 && !showStageModal && (
        <>
          {staticMarkersCoordinates.map((pt, idx) =>
            pt.clicked ? null : (
              <div
                key={idx}
                onClick={() => handleStaticMarkerClick(idx)}
                style={{
                  position: "absolute",
                  left: pt.x - 15,
                  top: pt.y - 15,
                  width: 30,
                  height: 30,
                  background: "rgb(0,123,255)",
                  borderRadius: "50%",
                  cursor: "pointer",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Внутренний белый кружок диаметром ~ половина внешнего */}
                <div
                  style={{
                    width: 15,
                    height: 15,
                    background: "white",
                    borderRadius: "50%",
                  }}
                />
              </div>
            )
          )}
        </>
      )}

      {/* 3. Если мы на этапе 2 и modal открыт → показываем этап 2-инструкцию */}
      {stage === 2 && showStageModal && (
        <Modal
          title="Этап 2: Сбор динамических точек"
          text={`На экране появится один маркер. Через ${WAIT_BEFORE_MOVE_MS /
            1000} секунд он начнёт движение. Необходимо наблюдать за маркером на протяжении всего времени его движения. Нажмите 'ОК', чтобы начать.`}
          onConfirm={handleStage2Confirm}
          confirmText="ОК"
          confirmDisabled={disableConfirm}
        />
      )}

      {/* 4. Если мы на этапе 2 и modal закрыт → рисуем один маркер (статично, пока не пройдет WAIT_BEFORE_MOVE_MS) */}
      {stage === 2 && !showStageModal && !dynamicMoving && (
        <div
          style={{
            position: "absolute",
            width: 30,
            height: 30,
            left: dynamicMarkerPos.x - 15,
            top: dynamicMarkerPos.y - 15,
            background: "rgb(0,123,255)",
            borderRadius: "50%",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 15,
              height: 15,
              background: "white",
              borderRadius: "50%",
              zIndex: 11,
            }}
          />
        </div>
      )}

      {/* 5. Если уже началось движение (dynamicMoving === true) → рисуем маркер по dynamicMarkerPos */}
      {stage === 2 && dynamicMoving && (
              <div
                style={{
                  position: "absolute",
                  width: 30,
                  height: 30,
                  left: dynamicMarkerPos.x - 15,
                  top: dynamicMarkerPos.y - 15,
                  background: "rgb(0,123,255)",
                  borderRadius: "50%",
                  cursor: "pointer",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Внутренний белый кружок диаметром ~ половина внешнего */}
                <div
                  style={{
                    width: 15,
                    height: 15,
                    background: "white",
                    borderRadius: "50%",
                    zIndex: 11,
                  }}
                />
              </div>
      )}

      {/* Этап 3: модалка для дополнительного этапа */}
      {stage === 3 && showStageModal && (
        <Modal  
          title="Калибровка завершена"
          text="Основные этапы калибровки трекера завершены. Дополнительный этап обучения включает в себя наблюдение за курсором мышки. Пробел - включить/остановить отслеживание мышки, Esc - вызвать модальное окно для выхода"
          onConfirm={handleProceedAdditional}
          onCancel={handleStage3Exit}
          confirmText="Перейти"
          cancelText="Выйти"
        />
      )}

      {/* Этап 4: доп. обучение */}
      {stage === 4 && (
        <>
          {/* Метка, показывающая, включен ли трекинг */}
          <div
            style={{
              position: "fixed",
              top: 10,
              left: 10,
              padding: "8px 12px",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              borderRadius: 4,
              zIndex: 100,
              fontSize: 14,
            }}
          >
            Tracking: {isTracking ? "ON" : "OFF"} (Space — переключить, Esc — завершить)
          </div>
        </>
      )}
      
      {/* Модалка выхода из доп. обучения */}
      {stage === 4 && showExitModal && (
        <Modal
          title="Завершить дополнительное обучение?"
          text="Вы действительно хотите завершить дополнительное обучение и сохранить собранные данные?"
          onConfirm={handleConfirmExitAdditional}
          onCancel={handleCancelExitAdditional}
          confirmText="Да"
          cancelText="Нет"
        />
      )}
    </div>
  );
};

export default TrainingPage;

