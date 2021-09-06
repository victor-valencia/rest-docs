# [REST-Docs](https://github.com/victor-valencia/rest-docs)

Migration for version `0.x` to `1.x`.

## Table of contents
- [Api_config for 0.x](#api_config-for-0.x)
- [Api_config for 1.x](#api_config-for-1.x)
- [Author](#author)
- [License](#license)

Simply change the `routes` variable to the` routes.tb`.

## Api_config for 0.x

```javascript
const api_config = {
  //...
  routes: [
    {      
      table: 'animals', //<-- YOUR_TABLE_NAME
      event: 'ANIMAL', //<-- YOUR_EVENT_NAME 
      methods: ['GET', 'POST', 'PUT', 'DELETE'], //<-- YOUR_METHODS
      //Used only by methods 'POST' and 'PUT'
      columns: [
          {name: 'id', primary: true},
          {name: 'name'}
      ]
    }
  ]
}
```

## Api_config for 1.x

```javascript
const api_config = {
  //...
  routes: {
    tb: [
      {      
        table: 'animals', //<-- YOUR_TABLE_NAME
        event: 'ANIMAL', //<-- YOUR_EVENT_NAME 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], //<-- YOUR_METHODS
        //Used only by methods 'POST' and 'PUT'
        columns: [
            {name: 'id', primary: true},
            {name: 'name'}
        ]
      }
    ]
  } 
}
```

## Author

@[victor-valencia](https://github.com/victor-valencia).

## License

Licensed under the [MIT license](/LICENSE).