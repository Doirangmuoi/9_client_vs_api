export interface Student{
    rollNumber : string;
    email : string;
    fullName : string;
    phone : string;
}

export interface ApiResponse<T>{
    success : boolean;
    message : string;
    data? : T;
    total? : number;
    errors? : any;
}