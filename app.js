import { readFileSync, writeFileSync } from 'fs'
import translate from 'translate'

const MODEL_M8_PATH = 'src/models-m8/Pessoa.cs'
const MODEL_IGNORE_PROPERTIES = ['Id', 'Ativo']

const fileContent = readFileSync(MODEL_M8_PATH, 'utf8')

const classNameMatch = fileContent.match(/public class (\w+)/)
const propertyRegex = /public (\w+) (\w+) { get; set; }/g

if (!classNameMatch) {
  console.error('Nome da classe não encontrado no arquivo.')
  process.exit(1)
}

const className = classNameMatch[1]
const properties = []

let match
while ((match = propertyRegex.exec(fileContent)) !== null) {
  properties.push({ type: match[1], name: match[2] })
}

const tsTypes = {
  int: 'number',
  string: 'string',
  DateTime: 'Date',
  bool: 'boolean',
  double: 'number',
  char: 'string',
  float: 'number',
  decimal: 'number',
  long: 'number',
  byte: 'number',
  BooleanEnum: 'NumericBoolean',
}

const typeGroups = {
  select2: [],
  number: [],
  string: [],
  Date: [],
  boolean: [],
  NumericBoolean: [],
}

const translateWord = async word => {
  try {
    let translated = await translate(word, { to: 'en', from: 'pt' })
    // Se a tradução é uma única palavra, converte para minúscula
    if (!translated.includes(' ')) {
      translated = translated.toLowerCase()
    }
    return translated
  } catch {
    return word // Fallback para a palavra original se a tradução falhar
  }
}

const createTypeScriptClassFile = async () => {
  try {
    const translatedClassName = await translateWord(className)
    const tsClassName =
      translatedClassName.charAt(0).toUpperCase() + translatedClassName.slice(1)

    let mappingFieldsSelect2 = ''
    let mappingFieldsRegular = ''
    let groupedProperties = ''

    for (const { type, name } of properties) {
      if (MODEL_IGNORE_PROPERTIES.includes(name)) continue // Ignora as propriedades especificadas

      const tsType = tsTypes[type] || 'any'
      let translatedPropertyName = await translateWord(name)

      // Ajuste de capitalização específica para campos esperados
      if (name === 'Nome') {
        translatedPropertyName = 'name'
      } else if (name === 'Inicial') {
        translatedPropertyName = 'initial'
      } else if (name === 'IsAdmin') {
        translatedPropertyName = 'isAdmin'
      } else if (name === 'NivelAcesso') {
        translatedPropertyName = 'levelAccess'
      } else {
        translatedPropertyName = translatedPropertyName.replace(/\s+/g, '')
        translatedPropertyName =
          translatedPropertyName.charAt(0).toLowerCase() +
          translatedPropertyName.slice(1)
      }

      if (
        name !== 'Id' &&
        name !== 'Nome' &&
        (/Id$/.test(name) || /Nome$/.test(name))
      ) {
        const prefix = name.match(/^(.*?)(Id|Nome)$/)[1]
        if (prefix) {
          const translatedPrefix = await translateWord(prefix)
          const camelCaseTranslatedPrefix =
            translatedPrefix.charAt(0).toLowerCase() + translatedPrefix.slice(1)

          if (/Id$/.test(name)) {
            mappingFieldsSelect2 += `    '${camelCaseTranslatedPrefix}.id': '${name}',\n`
          } else if (/Nome$/.test(name)) {
            mappingFieldsSelect2 += `    '${camelCaseTranslatedPrefix}.name': '${name}',\n`
          }

          if (
            !typeGroups.select2.includes(
              `  ${camelCaseTranslatedPrefix}?: select2;`
            )
          ) {
            typeGroups.select2.push(`  ${camelCaseTranslatedPrefix}?: select2;`)
          }
        }
      } else {
        mappingFieldsRegular += `    '${translatedPropertyName}': '${name}',\n`
        typeGroups[tsType].push(`  ${translatedPropertyName}?: ${tsType};`)
      }
    }

    groupedProperties = Object.values(typeGroups)
      .filter(group => group.length > 0)
      .map(group => group.join('\n'))
      .join('\n\n')

    const classContent = `export class ${tsClassName} extends Mapper {
  mappingFields = {
${mappingFieldsSelect2}
${mappingFieldsRegular}  }

${groupedProperties}
}
`

    writeFileSync(`src/models-topcar/${tsClassName}.ts`, classContent)
    console.log(`Arquivo ${tsClassName}.ts criado com sucesso.`)
  } catch (err) {
    console.error('Erro ao traduzir ou escrever o arquivo:', err)
  }
}

createTypeScriptClassFile()
