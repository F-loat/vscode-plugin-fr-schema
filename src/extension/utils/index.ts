import Json2Interface from './json2interface';

interface Schema {
  type?: string;
  properties?: any;
  items?: any;
}

const defaultValue: any = {
  boolean: false,
  integer: 1,
  null: null,
  number: 0,
  range: [],
  string: '',
};

const getModelFromSchema: (schema: Schema) => any = ({
  type = 'string',
  properties = {},
  items = {}
}) => {
  if (type === 'object') {
    return Object.keys(properties).reduce((result, key) => {
      return {
        ...result,
        [key]: getModelFromSchema(properties[key])
      }
    }, {})
  }

  if (type === 'array') {
    return [getModelFromSchema({
      type: 'object',
      properties: items,
      items: null
    })]
  }

  return defaultValue[type];
}

export {
  getModelFromSchema,
  Json2Interface
}
