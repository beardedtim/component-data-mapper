const fs = require('fs')
const path = require('path')
const React = require('react');
const { configuredWith } = require('../modules')
const { configureObject } = require('../modules/utils.js')
const { shallow, mount } = require('enzyme');

const DEMO = (props) => {
  const {
    id: {
      value: id
    }
  } = props.document
  return (<h2>I am a component!</h2>);
}

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'config.json'), 'utf8'))
DEMO.displayName = 'DEMO';

describe('configuredWith', () => {
  test('should return a configured component', () =>{
    const Component = configuredWith({
                      document: {
                        type: 'nested',
                        key: 'document',
                        value: config,
                      },
                    },
                    DEMO
                  )
    const wrapper = mount(
      <Component
        document={    {
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
        }}
      />
    )
    expect(wrapper.find('DEMO').prop('document')).toEqual({
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
  test('works with destructing the prop', () =>{
    const WITH_PROPS = ({ document }) => {
      const {
        id: {
          value: id
        },
        title: {
          value: title
        }
      } = document
      return (
        <h2>I have an id of {id} and title {title}</h2>
      )
    }

    WITH_PROPS.displayName = 'WITH_PROPS'
    const Component = configuredWith({
      document: {
        type: 'nested',
        key: 'document',
        value: {
          id: {
            type: 'basic',
            key: 'docId'
          },
          title: {
            type: 'basic',
            key: 'postTitle'
          }
        }
      }
    }, WITH_PROPS);
    const wrapper = mount(
      <Component
        document={{
          docId: 1,
          postTitle: 'This is a title!'
        }}
      />
    )
    expect(wrapper.find('WITH_PROPS').prop('document')).toEqual({
      id: {
        value: 1
      },
      title: {
        value: 'This is a title!'
      }
    })
    expect(wrapper.find('WITH_PROPS').text()).toEqual(
      'I have an id of 1 and title This is a title!'
    )
  })
})
