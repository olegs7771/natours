class Car{
  constructor(name,price){
    this.name=name;
    this.price=price
  }
  getFullDetails(){
    return this.name + ' '+this.price
  }
}


let Fiat = new Car('Fiat',1000);

console.log(Fiat.getFullDetails())