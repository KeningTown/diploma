import re

import pymorphy3

morph = pymorphy3.MorphAnalyzer()

POS = [
    "NOUN",
    "ADJF",
    "ADJS",
    "COMP",
    "VERB",
    "INFN",
    "PRTF",
    "PRTS",
    "GRND",
    "NUMR",
    "ADVB",
]


def trim(text: str):
    return re.sub(" +", " ", text.strip())


def get_tokens(text: str):
    trimmed = trim(text)
    parts = trimmed.split(" ")

    tokens = []

    for part in parts:
        words = list(re.finditer("\w+", part))

        # только пунктуация
        if not words:
            tokens.append(part)
            continue

        first_start, _ = words[0].span()
        _, last_end = words[-1].span()

        word = part[first_start:last_end]
        parsed = morph.parse(word)[0]

        if parsed:
            token = {
                "parsed": parsed,
                "w": word,
                "f": len(word) / 100,
            }

            left = part[0:first_start]  # знак пунктуации слева
            right = part[last_end:]  # знак пунктуации справа

            if left:
                token["l"] = left

            if right:
                token["r"] = right

            tokens.append(token)

    return tokens


def get_tokens_with_terms(terms: list, text: list):
    tokens = get_tokens(text)

    for term in terms:
        parts = term["term"].split(" ")
        term["parts_len"] = len(parts)
        term["parts"] = parts

    terms = sorted(terms, key=lambda term: term["parts_len"], reverse=True)

    for term in terms:
        length = term["parts_len"]
        i = 0

        while True:
            if i > len(tokens) - length:
                break

            is_term = True
            j = 0

            while j < length:
                token = tokens[i + j]
                is_str = type(token) is str

                if not is_str and "id" in token:
                    is_term = False
                    break

                part = term["parts"][j]
                parsed = morph.parse(part)[0]
                normal = parsed.normal_form if parsed else part

                if (is_str and token != normal) or (
                    token["parsed"].normal_form != normal
                ):
                    is_term = False
                    break

                j += 1

            if is_term:
                parts = tokens[i : i + length]

                def add_part(part):
                    tokens.pop(i)

                    return part["w"]

                word = " ".join(map(add_part, parts))

                new_token = {"id": term["id"], "w": word, "d": term["hasDefinition"]}

                if "frequency" in term:
                    new_token["f"] = term["frequency"]

                # TODO: phrases (length > 1)
                if length == 1 and term["synonyms"]:
                    parsed = morph.parse(word)[0]

                    if parsed:
                        synonyms = []

                        for synonym in term["synonyms"]:
                            synonym_parsed = morph.parse(synonym["term"])[0]

                            if not synonym_parsed:
                                continue

                            grammemes = {parsed.tag.case, parsed.tag.number}
                            prev_token = tokens[i - 1]

                            if (
                                prev_token
                                and type(prev_token) is not str
                                and "parsed" in prev_token
                            ):
                                # TODO: more cases
                                if prev_token["parsed"].tag.POS == "ADJF":
                                    grammemes = {
                                        prev_token["parsed"].tag.case,
                                        prev_token["parsed"].tag.number,
                                    }

                            inflected = synonym_parsed.inflect(grammemes)

                            if not inflected:
                                continue

                            word = inflected.word

                            if new_token["w"][0].isupper():
                                word = word[0].upper() + word[1:]

                            frequency = (
                                synonym["frequency"]
                                if "frequency" in synonym
                                else len(word) / 100
                            )

                            new_synonym = {
                                "id": synonym["id"],
                                "w": word,
                                "d": synonym["hasDefinition"],
                                "f": frequency,
                            }

                            synonyms.append(new_synonym)

                        if synonyms:
                            new_token["s"] = synonyms

                first_part = parts[0]
                last_part = parts[-1]

                if "l" in first_part:
                    new_token["l"] = first_part["l"]

                if "r" in last_part:
                    new_token["r"] = last_part["r"]

                tokens.insert(i, new_token)

            i += 1

    for i, token in enumerate(tokens):
        if type(token) is str:
            continue

        if "parsed" in token:
            if token["parsed"].tag.POS not in POS:
                word = ""

                if "l" in token:
                    word += token["l"]

                word += token["w"]

                if "r" in token:
                    word += token["r"]

                tokens[i] = word
                continue

            del token["parsed"]

        if "f" in token:
            token["f"] = round(token["f"], 2)

    return tokens
