import fs from 'node:fs'

function openFile() {
  // Pega o TERCEIRO parâmetro da linha de comando
  const filename = process.argv[2]

  // Se o nome do arquivo tiver sido fornecido, vamos
  // abri-lo e lê-lo
  if(filename) {
    try {
      return fs.readFileSync(filename, 'utf-8')
    }
    catch(error) {
      console.error(error)
      process.exit(-1)  // Termina a execução com erro
    }
  }
  else {
    console.log('Usage: node lexer.js <filename>')
    console.log('No filename provided.')
    process.exit(-1)
  }
}

// Ler o arquivo do código-fonte e colocar
// o conteúdo na constante "source"
const source = openFile()

const table = []  // Tabela de símbolos
let state = 0     // Estado inicial
let lexeme = ''   // Lexema
let char = ''     // Caractere atual

function isDigit(char) {
  return char.match(/[0-9]/)
}

function isLetter(char) {
  return char.match(/[A-Za-z]/)
}

function letterOrDigit(char) {
  return isLetter(char) || isDigit(char)
}

function isBlank(char) {
  return [' ', '\t', '\n', '\r'].includes(char)
}

function goToState(newState) {
  if(! isBlank(char)) lexeme += char
  state = newState
}

function resetLexeme() {
  lexeme = ''
  state = 0
}

function error() {
  console.log(table)
  console.error(`==> Error processing lexeme "${lexeme}" at state ${state}, char "${char}"`)
  process.exit(-1)
}

// Percorre o código-fonte, caractere a caractere
for(char of source) {

  // Máquina de estados (autômato finito)
  switch(state) {
    case 0:   // Estado inicial
      if(char === 'r') goToState(1)
      else if(char === 'w') goToState(7)
      else if(isDigit(char)) goToState(13)
      else if(letterOrDigit(char)) goToState(5)
      else if(char === '.') goToState(15)
      else if(char === ':') goToState(17)
      else if(char === '+') goToState(6.5)
      else if(char === '-') goToState(6.6)
      else if(char === '*') goToState(6.7)
      else if(char === '/') goToState(6.8)
      else if(char === '(') goToState(6.9)
      else if(char === ')') goToState(6.11)
      else if(isBlank(char)) goToState(0)
      else error()
      break

    case 1:
      if(char === 'e') goToState(2)
      else if(letterOrDigit(char)) goToState(5)
      else if(isBlank(char)) goToState(6.2)
      else error()
      break

    case 2:
      if(char === 'a') goToState(3)
      else if(letterOrDigit(char)) goToState(5)
      else error()
      break

    case 3:
      if(char === 'd') goToState(4)
      else if(letterOrDigit(char)) goToState(5)
      else error()
      break

    case 4:
      if(isBlank(char)) goToState(6.1)
      else if(letterOrDigit(char)) goToState(5)
      else error()
      break
      
    case 5:
      if(letterOrDigit(char)) goToState(5)
      else if(isBlank(char)) goToState(6.2)
      else error()
      break
      
    case 6.1:
      // Insere o lexema "read" na tabela de símbolos
      table.push({
        lexeme,
        tokenName: 'KEYWORD',
        tokenValue: lexeme
      })
      resetLexeme()
      break

    case 6.2:
      // Insere o lexema na tabela de símbolos como
      // um identificador
      table.push({
        lexeme,
        tokenName: 'IDENTIFIER',
        tokenValue: lexeme
      })
      resetLexeme()
      break

    case 6.3:
      // Insere o lexema na tabela de símbolos como
      // um número
      table.push({
        lexeme,
        tokenName: 'NUMBER',
        tokenValue: lexeme
      })
      resetLexeme()
      break

    case 6.4:
      // Insere o lexema na tabela de símbolos como o
      // token ASSIGN
      table.push({
        lexeme,
        tokenName: 'ASSIGN'
      })
      resetLexeme()
      break

    case 6.5:
      // Insere o lexema na tabela de símbolos como o
      // token PLUS
      table.push({
        lexeme,
        tokenName: 'PLUS'
      })
      resetLexeme()
      break

    case 6.6:
      // Insere o lexema na tabela de símbolos como o
      // token MINUS
      table.push({
        lexeme,
        tokenName: 'MINUS'
      })
      resetLexeme()
      
      
    case 6.7:
      // Insere o lexema na tabela de símbolos como o
      // token TIMES
      table.push({
        lexeme,
        tokenName: 'TIMES'
      })
      resetLexeme()
      break

    case 6.8:
      // Insere o lexema na tabela de símbolos como o
      // token DIV
      table.push({
        lexeme,
        tokenName: 'DIV'
      })
      resetLexeme()
      break

    case 6.9:
      // Insere o lexema na tabela de símbolos como o
      // token LPAREN
      table.push({
        lexeme,
        tokenName: 'LPAREN'
      })
      resetLexeme()
      break

    // case 6.10 seria igual a 6.1

    case 6.11:
      // Insere o lexema na tabela de símbolos como o
      // token RPAREN
      table.push({
        lexeme,
        tokenName: 'RPAREN'
      })
      resetLexeme()
      break

    case 7:
      if(char === 'r') goToState(8)
      else if(letterOrDigit(char)) goToState(5)
      else error()
      break

    case 8:
      if(char === 'i') goToState(9)
      else if(letterOrDigit(char)) goToState(5)
      else error()
      break

    case 9:
      if(char === 't') goToState(10)
      else if(letterOrDigit(char)) goToState(5)
      else error()
      break

    case 10:
      if(char === 'e') goToState(11)
      else if(letterOrDigit(char)) goToState(5)
      else error()
      break

    case 11:
      if(isBlank(char)) goToState(6.1)
      else if(letterOrDigit(char)) goToState(5)
      else error()
      break

    // case 12:     // Idêntico ao estado 6.1

    case 13:
      if(isDigit(char)) goToState(13)
      else if(char === '.') goToState(14)
      else if(isBlank(char)) goToState(6.3)
      else error()
      break

    case 14:
      if(isBlank(char)) goToState(6.3)
      else if(isDigit(char)) goToState(15)
      else error()
      break

    case 15:
      if(isDigit(char)) goToState(16)
      else error()
      break

    case 16:
      if(isDigit(char)) goToState(16)
      else if(isBlank(char)) goToState(6.3)
      else error()
      break

    case 17:
      if(char === '=') goToState(6.4)
      else error()
      break

  }
}

console.log(table)