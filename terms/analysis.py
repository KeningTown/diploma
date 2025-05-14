import pymorphy3
from ruwordnet_copy.ruwordnet import RuWordNet

from tokens import get_tokens

morph = pymorphy3.MorphAnalyzer()
wn = RuWordNet(filename_or_session="./ruwordnet_copy/ruwordnet.db")

NOUN_ADJ = False  # поиск словосочетаний сущ. + прил.
NOUN_PREP_NOUN = False  # поиск словосочетаний сущ. + предлог + сущ.
REPLACE_WORD_WITH_PHRASE = False  # заменять слова словосочетаниями

PUNCT_RIGHT = ['"', "'", "»"]
PUNCT_LEFT = ['"', "'", "«"]

NOMN_GRAMMEMES = {"nomn"}  # только имен. падеж
NORM_GRAMMEMES = {"nomn", "sing"}  # имен. падеж, ед. число

MIN_LENGTH = 3
MIN_FREQ = 0.1
MAX_FREQ = 1

REL = [
    "hypernyms",
    "hyponyms",
    "holonyms",
    "meronyms",
    "pos_synonyms",
]
REL_IN_TEXT = ["hypernyms", "hyponyms", "holonyms", "meronyms"]
POS = ["NOUN", "ADJF", "PREP"]


def check_punct(token, key="r"):
    punct = PUNCT_RIGHT if key == "r" else PUNCT_LEFT

    if key not in token or token[key] in punct:
        return True

    return False


def inflect(parsed, gender=None):
    grammemes = set(NORM_GRAMMEMES)

    if gender:
        grammemes.add(gender)

    return parsed.inflect(grammemes)


def get_phrase_words(t1, next_tokens):
    next_tokens_len = len(next_tokens)

    if next_tokens_len < 1:
        return None

    t2 = next_tokens[0]

    if type(t2) is str or not check_punct(t2, "l"):
        return None

    t2_w = t2["w"].lower()

    if t2_w == t1["w"].lower():
        return None

    t1_p = t1["parsed"]
    t2_p = t2["parsed"]

    t1_pos = t1_p.tag.POS
    t2_pos = t2_p.tag.POS

    is_t2_noun = t2_pos == "NOUN"

    if t1_pos == "NOUN":
        t1_norm = t1_p.normal_form

        if is_t2_noun:
            # сущ. + сущ. (охрана труда)

            return [t1_norm, t2_w]

        if NOUN_ADJ and t2_pos == "ADJF":
            # сущ. + прил. (персонал электротехнологический)

            t1_inflected = inflect(t1_p)
            t2_inflected = None

            if not t1_inflected:
                if "Pltm" in t1_p.tag:
                    # слово всегда во множественном числе, например, "данные"
                    t1_inflected = t1_p.inflect(NOMN_GRAMMEMES)
                    t2_inflected = t2_p.inflect(NOMN_GRAMMEMES)
                else:
                    return None

            if not t1_inflected:
                return None

            if not t2_inflected:
                t2_inflected = inflect(t2_p, t1_inflected.tag.gender)

            if not t2_inflected:
                return None

            return [t1_inflected.word, t2_inflected.word]

        if NOUN_PREP_NOUN and check_punct(t2) and t2_pos == "PREP":
            if next_tokens_len < 2:
                return None

            t3 = next_tokens[1]

            if type(t3) is str or not check_punct(t3, "l"):
                return None

            t3_w = t3["w"].lower()

            if t3_w == t2_w:
                return None

            if t3["parsed"].tag.POS == "NOUN":
                # сущ. + предлог + сущ. (инструкция по эксплуатации)

                return [t1_norm, t2_w, t3["w"].lower()]

    if t1_pos == "ADJF" and is_t2_noun:
        # прил. + сущ. (электротехнологический персонал)

        t1_inflected = None
        t2_inflected = inflect(t2_p)

        if not t2_inflected:
            if "Pltm" in t2_p.tag:
                # слово всегда во множественном числе, например, "данные"
                t2_inflected = t2_p.inflect(NOMN_GRAMMEMES)
                t1_inflected = t1_p.inflect(NOMN_GRAMMEMES)
            else:
                return None

        if not t2_inflected:
            return None

        if not t1_inflected:
            t1_inflected = inflect(t1_p, t2_inflected.tag.gender)

        if not t1_inflected:
            return None

        return [t1_inflected.word, t2_inflected.word]

    return None


def get_words(tokens):
    words = []
    i = 0

    while i < len(tokens):
        token = tokens[i]

        if type(token) is str or len(token["w"]) < MIN_LENGTH:
            i += 1
            continue

        if check_punct(token):
            phrase_words = get_phrase_words(token, tokens[i + 1 : i + 3])

            if phrase_words:
                phrase = " ".join(phrase_words)

                words.append(phrase)

                if REPLACE_WORD_WITH_PHRASE:
                    i += len(phrase_words)
                    continue

        if token["parsed"].tag.POS == "NOUN":
            words.append(token["parsed"].normal_form)

        i += 1

    return words


def get_terms(words):
    word_count = {}
    min_freq = 1000000
    max_freq = 0

    for word in words:
        if word not in word_count:
            word_count[word] = 0

        count = word_count[word] + 1
        word_count[word] = count

        if count > max_freq:
            max_freq = count

        if count < min_freq:
            min_freq = count

    denominator = max_freq - min_freq

    result = []

    for word, count in word_count.items():
        freq = (count - min_freq) / denominator if denominator != 0 else 1

        if freq >= MIN_FREQ and freq <= MAX_FREQ:
            result.append({"term": word, "frequency": freq})

    return result


def get_relations(term, all_words):
    senses = wn.get_senses(term)

    if not senses:
        return None

    relation_map = {}

    for sense in senses:
        for type in REL:
            synsets = getattr(sense.synset, type)

            if not synsets:
                continue

            words = []

            for synset in synsets:
                # удаление пояснений в скобках ()
                title = synset.title.lower().split("(")[0].strip()
                parts = title.split(", ")

                for word in parts:
                    if word == term:
                        continue

                    word_parts = word.split(" ")
                    add_word = True

                    for word_part in word_parts:
                        parsed = morph.parse(word_part)[0]

                        if parsed.tag.POS not in POS:
                            add_word = False
                            break

                    if not add_word or (type in REL_IN_TEXT and word not in all_words):
                        continue

                    words.append(word)

            if not words:
                continue

            if type not in relation_map:
                relation_map[type] = []

            relation_map[type] += words

    relations = []

    for type, terms in relation_map.items():
        relations.append({"type": type, "terms": list(set(terms))})

    return relations


def analyze(text: str):
    tokens = get_tokens(text)
    words = get_words(tokens)
    terms = get_terms(words)

    for term in terms:
        try:
            relations = get_relations(term["term"], words)

            if relations:
                term["relations"] = relations
        except Exception:
            continue

    return terms
