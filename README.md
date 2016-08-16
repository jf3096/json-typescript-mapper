# json-typescript-mapper

## Introduction

For single page application, data sources are obtained from API server. Instead of directly using api data, we 
definitely require an adapter layer to transform data as needed. Furthermore, 
the adapter inverse the the data dependency from API server(API Server is considered uncontrollable and 
highly unreliable as data structure may be edit by backend coder for some specific purposes)to our adapter 
which becomes reliable. Thus, this library is created as the adapter.

### Get Started
```bash
npm install json-typescript-mapper --save
```
## Environment
* NodeJS
* Browser

## Language
* Typescript

### Typescript

```bash
import {deserialize} from 'json-typescript-mapper';

deserialize(<Class Type>, <JSON Object>);
```

## Example 
Here is a complex example, hopefully could give you an idea of how to use it (for more on how to use, checkout /spec which are unit test cases):

```bash
class Student {
    @JsonProperty('name')
    fullName:string;

    constructor() {
        this.fullName = undefined;
    }
}

class Address {
    @JsonProperty('first-line')
    firstLine:string;
    @JsonProperty('second-line')
    secondLine:string;
    @JsonProperty({clazz: Student})
    student:Student;
    city:string;

    constructor() {
        this.firstLine = undefined;
        this.secondLine = undefined;
        this.city = undefined;
        this.student = undefined
    }
}

class Person {
    @JsonProperty('Name')
    name:string;
    @JsonProperty('xing')
    surname:string;
    age:number;
    @JsonProperty({clazz: Address, name: 'AddressArr'})
    addressArr:Address[];
    @JsonProperty({clazz: Address, name: 'Address'})
    address:Address;

    constructor() {
        this.name = void 0;
        this.surname = void 0;
        this.age = void 0;
        this.addressArr = void 0;
        this.address = void 0;
    }
}
```

Now here is what API server return, assume it is already parsed to JSON object.
```bash
let json = {
  "Name": "Mark",
  "xing": "Galea",
  "age": 30,
  "AddressArr": [
      {
          "first-line": "Some where",
          "second-line": "Over Here",
          "city": "In This City",
          "student": {
              name1: "Ailun"
          }
      },
      {
          "first-line": "Some where",
          "second-line": "Over Here",
          "city": "In This City",
          "student": {
              name1: "Ailun"
          }
      }
  ],
  "Address": {
      "first-line": "Some where",
      "second-line": "Over Here",
      "city": "In This City",
      "student": {
          name: "Ailun"
      }
  }
```

Simply, just map it use following code. The mapping is based on <@JsonProperty> decorator meta data.

```bash
const person = deserialize(Person, json);
```

## Notice
Remember to add: <b>experimentalDecorators</b> and <b>emitDecoratorMetadata</b> in your tsconfig.json. 
This is essential to enable decorator support for your typescript program. Example shown as followings:

```bash
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "exclude": [
    "node_modules"
  ]
}
```
## Test Report
The test case will be covered in the next push. This caused by inconsistent return type.
![alt tag](/git-img/Test Results — spec_index.ts.png)

## Fixed
1) Fixed test cases. According to typescript official website tips [NULL IS BAD](https://basarat.gitbooks.io/typescript/content/docs/tips/null.html), 
therefore I updated all null value to void 0 which is a better expression than undefined (idea from underscore source code). 
Most cases it won't affect previous version at all.


## Roadmap:
1) Fully json mapping to the modal class convention should be provided. 
If any unmapped variable discover, throw exception! 
This could be useful to detect if API data has change it data structure in the unit testing phrase.

2) Runtime data type validation might be a good idea. Alternatively, if this feature is not covered in the future, I will make use of json schema concept instead.