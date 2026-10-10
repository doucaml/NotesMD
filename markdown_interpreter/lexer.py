from collections import namedtuple
from pprint import pprint

Token = namedtuple("Token", ["token_type", "value"])

SYMBOLS = {
    "HASH_TAG": "#",
    "HYPHEN_MINUS": "-",
    "DOT": ".",
    "NEWLINE": "\n",
    "LESS_THAN_SIGN": "<",
    "MORE_THAN_SIGN": ">",
    "LEFT_BRACKET": "[",
    "RIGHT_BRACKET": "]",
    "LEFT_PARENTHESIS": "(",
    "RIGHT_PARENTHESIS": ")",
    "ASTERIX": "*",
    "TILDE": "~",
    "GRAVE_ACCENT": "`",
    "EXCLAMATION_MARK": "!",
    "PIPE": "|",
    "BACKSLASH": "\\",
    "EOF": "EOF",
    "WORD": "WORD",
    "SPACE": " ",
}

SYMBOLS_KEYS = SYMBOLS.keys()
TEXT_DECORATION_SYMBOLS = [SYMBOLS["ASTERIX"], SYMBOLS["TILDE"]]


class Lexer:
    def __init__(self, text):
        self.text = text
        self.current_char_index = 0
        self.current_char = (
            self.text[self.current_char_index] if len(text) > 0 else SYMBOLS["EOF"]
        )

    def next_char(self):
        if self.current_char_index >= len(self.text) - 1:
            self.current_char = SYMBOLS["EOF"]
            return

        self.current_char_index += 1
        self.current_char = self.text[self.current_char_index]

    def word(self):
        token_value = ""

        while not (
            self.current_char.isspace() or self.current_char in TEXT_DECORATION_SYMBOLS
        ):
            token_value += self.current_char
            self.next_char()

        return token_value

    def get_current_lexeme(self):
        token_value = ""

        if self.current_char == SYMBOLS["EOF"]:
            return Token("EOF", self.current_char)

        elif self.current_char == SYMBOLS["HASH_TAG"]:
            while self.current_char == SYMBOLS["HASH_TAG"]:
                token_value += self.current_char
                self.next_char()

            return Token("HASH_TAG", token_value)

        elif self.current_char == SYMBOLS["SPACE"]:
            self.next_char()
            return Token("SPACE", SYMBOLS["SPACE"])

        elif self.current_char == SYMBOLS["NEWLINE"]:
            token_value = self.current_char
            self.next_char()
            return Token("NEWLINE", token_value)

        else:
            token_value = self.word()
            return Token("WORD", token_value)

    def get_lexemes(self):
        lexemes = []
        current_token = self.get_current_lexeme()

        while current_token.token_type != "EOF":
            lexemes.append(current_token)
            current_token = self.get_current_lexeme()

        lexemes.append(current_token)

        return lexemes


if __name__ == "__main__":
    from pathlib import Path

    file = (Path(__file__).parent / "sample_test.md").resolve()

    with open(file) as f:
        content = f.read()

    lexer = Lexer(content)
    pprint(lexer.get_lexemes())
