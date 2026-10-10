
section-block = header-block | paragraph-block

header-block = header section-block

paragraph-block = blockquote-block | ordered-list-block | unordered-list block | simple-text-block | header-block

header = header-tag header-sentence header-tag

header-tag-block = header-tag | header-tag newline

blockquote-block = 1*(more-than-tag sentence newline)

ordered-list-block = 1*(ordered-list-tag list-block newline)

unordered-list-block = 1*(unordered-list-tag list-block newline)

simple-text-block = 1*(sentence newline)

ordered-list-tag = ordered-list-digit dot

unordered-list-tag = hyphen-minus

ordered-list-digit = \[1-9] \*(\[0-9])

hyphen-minus = -

header-tag = 1\*6( \# )

sentence = 1*(word)

word = 1\*(char)

char = \[ ^(whitespace) ]

whitespace = 1*(\n | \t | space)

space = 1*(\<space>)


