from collections import Counter
import operator
import math

from tokens import get_tokens, POS


def tokenize(text: str):
    tokens = get_tokens(text)
    items = []

    for token in tokens:
        if type(token) is not str and token["parsed"].tag.POS in POS:
            items.append(token["parsed"].normal_form)

    return items


def get_words(paragraphs: tuple):
    words = []

    for paragraph in paragraphs:
        tokens = tokenize(paragraph)

        for word in tokens:
            if word not in words:
                words.append(word)

    return words


def normalize_paragraph(paragraph: str, words: list):
    tokens = tokenize(paragraph)
    tokens_len = len(tokens)
    counter = Counter(tokens)

    for word in counter:
        counter[word] /= tokens_len

    items = []

    for word in words:
        items.append(counter[word])

    return items


def count_paragraphs_with_word(word, paragraphs):
    counter = 1

    for paragraph in paragraphs:
        if word in paragraph:
            counter += 1

    return counter


def calc_paragraphs(paragraphs, words: list):
    items = []
    paragraphs_len = len(paragraphs)

    for word in words:
        paragraphs_with_word = count_paragraphs_with_word(word, paragraphs)
        item = 1 + math.log10(paragraphs_len / paragraphs_with_word)

        items.append(item)

    return items


def build(paragraphs, paragraph, words: list):
    normalized_paragraph = normalize_paragraph(paragraph, words)
    calculated_paragraphs = calc_paragraphs(paragraphs, words)
    words_len = len(words)

    return [
        normalized_paragraph[i] * calculated_paragraphs[i] for i in range(words_len)
    ]


def dot(v1, v2):
    return sum(map(operator.mul, v1, v2))


def cos(v1, v2):
    d = dot(v1, v2)
    d1 = dot(v1, v1)
    d2 = dot(v2, v2)

    l1 = math.sqrt(d1)
    l2 = math.sqrt(d2)

    return d / (l1 * l2)


def calc_distance_for_doc(block: dict):
    paragraphs_ids = list(block.keys())
    paragraphs = tuple(block.values())
    words = get_words(paragraphs)

    total = []

    for paragraph in paragraphs:
        total.append(build(paragraphs, paragraph, words))

    result = {}

    for i, paragraph in enumerate(paragraphs):
        p_id = paragraphs_ids[i]
        result[p_id] = {}

        p = build(paragraphs, paragraph, words)

        for j, ps in enumerate(total):
            n_p_id = paragraphs_ids[j]
            result[p_id][n_p_id] = round(cos(p, ps), 2)

    return result
