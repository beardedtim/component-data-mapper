const path = require('path')
const fs = require('fs')
const {
 configureObject,
 handleArrayValue,
 handleObjectValue,
} = require('../modules/utils.js')

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'config.json'),'utf8'))
const data = {
      id: 1,
      grantorName: ['Matthew', 'Mark'],
      granteeName: ['Luke', 'John'],
      docType: 'SUPERTYPE',
      recordedDate: 'Recorded Date',
      instrumentDate: 'instrumentDate',
      documentNumber: 'some document number',
      legalDescription: 'Legal descriptions!',
      summary: 'This is a summary of the text!',
      thumbnail: 'http://',
      title: 'This is a title'
    }


describe('configureObject', () => {
  test('is a function', () => {
    expect(typeof configureObject).toBe('function')
  })
  test('is curried', () => {
    expect(typeof configureObject()()({})()()()).toBe('function')
  })
  test('should map data from one object to another using the config settings', () => {
    const demoConfig = {
            id: {
              type: 'basic',
              key: 'id'
            },
            title: {
              type: 'basic',
              key: 'postTitle'
            }
          },
          demoInput = {
            id: 1,
            postTitle: 'Real Title!'
          }
    expect(configureObject(demoConfig, demoInput)).toEqual({
      id: {
        value: 1
      },
      title: {
        value: 'Real Title!'
      }
    })
    const configured = configureObject(config,data)
    expect(configured).toEqual({
      id: {
        value: 1
      },
      type: {
        value: 'SUPERTYPE'
      },
      title: {
        value: 'This is a title',
        default: "This is a default value",
      },
      text: {
        value: 'This is a summary of the text!',
        default: "This is a defualt value for text"
      },
      thumbnail: {
        display: false,
        value: 'http://'
      },
      bodyColumns: [
        {
          name: "Document Number",
          value: 'some document number'
        },
        {
          name: "Instrument Date",
          value: 'instrumentDate'
        },
      ],
      footerColumns: [
        {
          name: 'Grantee',
          value: ['Luke', 'John']
        },
        {
          name: 'Grantor',
          value: ['Matthew', 'Mark']
        },
        {
          name: 'Legal Description',
          value: 'Legal descriptions!'
        }
      ]
    })
  })
  test('should still return values for those not found', () => {
    const config = {
            _id: {
              type: 'basic'
            }
          },
          input = {

          },
          configured = configureObject(config,input)
   expect(configured).toEqual({
     _id: {
       value: null
     }
   })
  })
  test('should handle no type found', () => {
    const config = {
            _id: {
              type: 'nada'
            }
          },
          input = {
            _id: 'uh oh'
          },
          configured = configureObject(config,input)
   expect(configured).toEqual({
     _id: {
       value: 'uh oh'
     }
   })
  })
})


describe('handleArrayValue', () => {
  test('should return an array', () => {
    const columnConfig = {
          values: [
            {
              key: 'name',
              name: 'First'
            },
            {
              key: 'last',
              name: 'Last'
            },
          ]
        },
        data = {
          name: 'Tim',
          last: 'Roberts'
        },
        handleColumn = handleArrayValue(columnConfig),
        column = handleColumn(data)
    expect(column).toEqual([
      {
        value: 'Tim',
        name: 'First'
      },
      {
        value: 'Roberts',
        name: 'Last'
      },
    ])
  })
  test('handles values not found in the data object', () => {
    const columnConfig = {
          values: [
            {
              key: 'name',
              name: 'First'
            },
            {
              key: 'last',
              name: 'Last'
            },
            {
              key: 'not-valid',
              name: 'Maybe there?'
            }
          ]
        },
        data = {
          name: 'Tim',
          last: 'Roberts'
        },
        handleColumn = handleArrayValue(columnConfig),
        column = handleColumn(data)
    expect(column).toEqual([
      {
        value: 'Tim',
        name: 'First'
      },
      {
        value: 'Roberts',
        name: 'Last'
      },
      {
        name: 'Maybe there?',
        value: null
      }
    ])
  })
});

describe('handleObjectValue', () => {
  test('should return an object', () => {

  })
});
