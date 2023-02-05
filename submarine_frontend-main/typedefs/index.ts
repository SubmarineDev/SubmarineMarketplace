export interface Person {
  id: BigInt;
  name: String;
  age: Number;
  sex: "M" | "F";
  addresses: Address[];
}

export interface Address {
  id: BigInt;
  locality: String;
  city: String;
  state: String;
  pincode: Number;
  country: String;
}
