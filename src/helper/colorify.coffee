colorToAnsi =
  # style
  style:
    normal: 0
    bold: 1
    underline:4
    blink:5
    strike:9
  # fore
  fore:
    black: 30
    red: 31
    green: 32
    yellow: 33
    blue: 34
    magenta: 35
    cyan: 36
    white: 37
    brightBlack: 90
    brightRed: 91
    brightGreen: 92
    brightYellow: 99
    brightBlue: 94
    brightMagenta: 95
    brightCyan: 96
    brightWhite: 97
  # back
  back:
    black: 40
    red: 41
    green: 42
    yellow: 43
    blue: 44
    magenta: 45
    cyan: 46
    white: 47
    brightBlack: 100
    brightRed: 101
    brightGreen: 102
    brightYellow: 103
    brightBlue: 104
    brightMagenta: 105
    brightCyan: 106
    brightWhite: 107

# ansi_color infomation from http://blog.csdn.net/gausszhch/article/details/5628009
module.exports = colorify = (text, fore, back, style = "normal") ->
  {fore, back, style} = fore unless typeof fore  is "string"
  result = []
  result.push foreCode if foreCode = colorToAnsi.fore[fore] || parseInt(fore)
  result.push backCode if backCode = colorToAnsi.back[back] || parseInt(back)
  result.push attrCode if attrCode = colorToAnsi.style[style] || parseInt(style)
  suffix = result.join ";"
  # \033 means ESC  bug in coffeescript cs no support with octal squens
  octpfx  = `"\033"` 
  reset = "#{octpfx}[0m"
  # return value
  "#{octpfx}[#{suffix}m#{text}#{reset}"

