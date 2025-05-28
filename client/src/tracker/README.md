// добавить текст про то какая модель обучена, где найти исходники и т.д. Не забыть сказать про keras2, keras3.
В рамках загрузки модели `gaze_prediction_model` имеют место 2 самописных слоя: `Normalization` (слой `keras.layers.Normalization` в `python`) и `TFOpLambda` (слой `tensorflow.python.keras.layers.core.TFOpLambda`) работающий с операцией `tf.multiply`. Обусловлено отсутствием данных слоев в api `tensorflow.js`. Без них модель не сможет загрузится и появится сообщение о соовтетствующей ошибке.

Также модель сохраненная в `model.js` имеет в себе изменения внесенные вручную. В слое `TFOpLambda` поле `inbound_nodes` принудительно требуется обернуть в дополнительный массив. Если этого не сделать, то при загрузки модели будет программа уйдет в бесконечный цикл внутри пакет `tensorflow.js` и вкладка повиснет без возможности восстановления. Обусловленно ошибкой либо у конвертора `tensorflowjs_converter`, либо ошибкой самого `tensorflow.js`. Issue на GitHub существует, но решать никто пока не собирается: https://github.com/tensorflow/tfjs/issues/7271

Также перед запуском модели требуется убедится, что в описании слоя `TFOpLambda` в `model.json` параметр `y` продублирован из `inbound_nodes`, в поле `config`. Если поле `y` будет отсутствовать в поле `config`, то в консоль выведется соответствующая ошибка и модель не запустится. Данный костыль обусловлен тем, что `tensorflow.js` не предоставляет возможности взаимодействовать с полем `inbound_nodes` напрямую.

Пример как выдает tensorflowjs_conterter после конвертации модели keras 2 в модель tensorflowjs:
```json
{
    "class_name": "TFOpLambda",
    "config": {
        "name": "tf.math.multiply_5",
        "trainable": true,
        "dtype": "float32",
        "function": "math.multiply"
    },
    "name": "tf.math.multiply_5",
    "inbound_nodes": [
        [
            "normalization_5",
            0,
            0,
            {
                "y": [
                    [
                        [
                            [
                                2.0896918773651123,
                                2.1128857135772705,
                                2.108185052871704
                            ]
                        ]
                    ]
                ]
            }
        ]
    ]
}
```

Как должно быть:
```json
{
    "class_name": "TFOpLambda",
    "config": {
        "name": "tf.math.multiply_5",
        "trainable": true,
        "dtype": "float32",
        "function": "math.multiply",
        "y": [
            [
                [
                    [
                        2.0896918773651123,
                        2.1128857135772705,
                        2.108185052871704
                    ]
                ]
            ]
        ]
    },
    "name": "tf.math.multiply_5",
    "inbound_nodes": [
        [
            [
                "normalization_5",
                0,
                0,
                {
                    "y": [
                        [
                            [
                                [
                                    2.0896918773651123,
                                    2.1128857135772705,
                                    2.108185052871704
                                ]
                            ]
                        ]
                    ]
                }
            ]
        ]
    ]
}
```

