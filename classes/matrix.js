"use strict";

import { randomDecimal } from "../utilityFunctions/utilityFunctions.js";
/********************* Matrix Functions ********************/

export class Matrix{
    constructor(rows, columns, data = []){
        //use private variable
        this._rows = rows;
        this._columns = columns;
        this._data = data;

        //#initialize with zeroes if no data provided
        if(data === null || data.length === 0){
            this._data = [];
            for(let i = 0; i < this._rows; i++){
                this._data[i] = [];
                for(let j = 0; j < this._columns; j++){
                    this._data[i][j] = 0;
                }
            }
        }
        else{
            //check the data integrity
            if(data.length !== rows || data[0].length != columns){ // is the size of the matrix correct 
                throw new Error("Invalid Matrix --> Incorrect data Dimensions!");
            }
        }
    }
    get rows(){ //use to get the information
        return this._rows;
    }
    get columns(){ //use to get the information
        return this._columns;
    }
    get data(){ //use to get the information
        return this._data;
    }
    static addTwoMatrices(m0, m1){ //add two Matrices
        this.checkMatricesDimensions(m0, m1);
        let matrix = new Matrix(m0.rows, m1.columns);
        for( let i = 0; i < matrix.rows; i++){
            for( let j = 0; j < matrix.columns; j++){
                matrix.data[i][j] = m0.data[i][j] + m1.data[i][j] // add the individual cells of the matrix together;
            
            }
        }
        return matrix;
    }
    static subtractTwoMatrices(m0, m1){ //subtract two Matrices
        this.checkMatricesDimensions(m0, m1);
        let matrix = new Matrix(m0.rows, m1.columns);
        for( let i = 0; i < matrix.rows; i++){
            for( let j = 0; j < matrix.columns; j++){
                matrix.data[i][j] = m0.data[i][j] - m1.data[i][j] // subtract the individual cells of the two matrices ;
            
            }
        }
        return matrix;
    }
    static multiplyTwoMatrices(m0, m1){ //multiply two Matrices (not the dot product)
        this.checkMatricesDimensions(m0, m1);
        let matrix = new Matrix(m0.rows, m1.columns);
        for( let i = 0; i < matrix.rows; i++){
            for( let j = 0; j < matrix.columns; j++){
                matrix.data[i][j] = m0.data[i][j] * m1.data[i][j] // multiply the individual cells of the two matrices ;
            
            }
        }
        return matrix;
    }
    static dotProductTwoMatrices(m0, m1){ //multiply two Matrices (the dot product)
        if(m0.columns !== m1.rows){
            throw new Error("dot product Matrix --> Matrices are of dot compatible!");
        }
        let matrix = new Matrix(m0.rows, m1.columns);
        for( let i = 0; i < matrix.rows; i++){
            for( let j = 0; j < matrix.columns; j++){
                let sum = 0;
                for( let k = 0; k < m0.columns; k++){
                    sum += m0.data[i][k] * m1.data[k][j] // multiply the individual cells of the two matrices ;
                }
                matrix.data[i][j] = sum;
            }
        }
        return matrix;
    }

    //convert array to one row matrix 
    static convertFromArrayToMatrix(arr){
        return new Matrix(1, arr.length, [arr])

    }
    //apply a function to each cell of a given matrix
    static mapMatrix(m0, mFunction){

        let matrix = new Matrix(m0.rows, m0.columns);
        for( let i = 0; i < matrix.rows; i++){
            for( let j = 0; j < matrix.columns; j++){
                matrix.data[i][j] = mFunction(m0.data[i][j]);
            }
        }
        return matrix
    }
    //find the transpose of the given matrix 
    static transposeMatrix(m0){
        let matrix = new Matrix(m0.columns, m0.rows);
        for( let i = 0; i < m0.rows; i++){
            for( let j = 0; j < m0.columns; j++){
                matrix.data[j][i] = m0.data[i][j];
            }
        }
        return matrix;
    }
    static checkMatricesDimensions(m0, m1){
        if(m0.rows !== m1.rows || m0.columns !== m1.columns){
            throw new Error("Invalid Matrix --> Matrices are of different Dimensions!");
        }
    }
    //apply random weight between -1 and 1
    randomWeights(){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                this.data[i][j] = randomDecimal(-1, 1)//Math.random() * 2 -1
            }
        }
    }
}