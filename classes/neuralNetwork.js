"use strict"

import { Matrix } from "./matrix.js";
import { sigmoid } from "../utilityFunctions/utilityFunctions.js";

export class NeuralNetwork{
    constructor(data, numInputs, numHidden, numOutputs){
        this.data = data;
        this._inputs = [];
        this._hidden = [];
        this._numInputs = numInputs;
        this._numHidden = numHidden;
        this._numOutputs = numOutputs;
        this._bias0 = new Matrix(1, this._numHidden); 
        this._bias1 = new Matrix(1, this._numOutputs);
        this._weights0 = new Matrix(this._numInputs, this._numHidden)//the weights between the input and the hidden layer
        this._weights1 = new Matrix(this._numHidden, this._numOutputs)//the weight between the hidden and the output layer
    
        //randomize the initial weights
        this._weights0.randomWeights();
        this._weights1.randomWeights();
        this._bias0.randomWeights();
        this._bias1.randomWeights();

        this.logOn = this.data.NN_LOG_ON;
        this.logCount = this.data.NN_LOG_FREQ;
    }
    get weights0(){
        return this._weights0;
    }
    set weights0(weights0){
        this._weights0 = weights0;
    }
    get weights1(){
        return this._weights1;
    }
    set weights1(weights1){
        this._weights1 = weights1;
    }
    get hidden(){
        return this._hidden;
    }
    set hidden(hidden){
        this._hidden = hidden;
    }
    get inputs(){
        return this._inputs;
    }
    set inputs(inputs){
        this._inputs = inputs;
    }
    get bias0(){
        return this._bias0;
    }
    set bias0(bias0){
        this._bias0 = bias0;
    }
    get bias1(){
        return this._bias1;
    }
    set bias1(bias1){
        this._bias1 = bias1;
    }
    feedForward(inputArray){
        //convert inputs to matrix
        this.inputs = Matrix.convertFromArrayToMatrix(inputArray);

        //find the hidden values and apply the activation function
        this.hidden = Matrix.dotProductTwoMatrices(this.inputs, this.weights0) //used to return a value between zero and one
        
        this.hidden = Matrix.addTwoMatrices(this.hidden, this.bias0) //apply bias

        this.hidden = Matrix.mapMatrix(this.hidden, x => sigmoid(x))

        //find the output values and apply the activation function
        let outputs = Matrix.dotProductTwoMatrices(this.hidden, this.weights1) //used to return a value between zero and one
        outputs = Matrix.addTwoMatrices(outputs, this.bias1) //apply bias to outputs
        outputs = Matrix.mapMatrix(outputs, x => sigmoid(x));

        return outputs;

    }
    trainNetwork(inputArray, targetArray){

        //feed the input data through the network
        let outputs = this.feedForward(inputArray);

        //calculate the output errors (targets - outputs)
        let targets = Matrix.convertFromArrayToMatrix(targetArray);
        let outputErrors = Matrix.subtractTwoMatrices(targets, outputs);
        if(this.logOn && this.logCount == this.data.NN_LOG_FREQ){
            console.log("Output Error = " + outputErrors.data[0][0]);
            this.logCount --;
            if(this.logCount == 0){
                this.logCount = this.data.NN_LOG_FREQ;
            }
        }

        //calculate the deltas (errors * derivative of the outputs)
        let outputDerivatives = Matrix.mapMatrix(outputs, x => sigmoid(x, true));
        let outputDeltas = Matrix.multiplyTwoMatrices(outputErrors, outputDerivatives);

        //calculate the hidden layers errors (deltas "dot" transpose of weights1)
        let weights1Transposed = Matrix.transposeMatrix(this.weights1);
        let hiddenErrors = Matrix.dotProductTwoMatrices(outputDeltas, weights1Transposed)

        //calculate the hidden delta errors (errors * derivative of hidden)
        let hiddenDerivatives = Matrix.mapMatrix(this.hidden, x => sigmoid(x, true));
        let hiddenDeltas = Matrix.multiplyTwoMatrices(hiddenErrors, hiddenDerivatives);
        // console.log("hidden Deltas")
        // console.table(hiddenDeltas.data)

        //update the weights (add hidden transpose of layers "dot" output deltas)
        let hiddenTransposed = Matrix.transposeMatrix(this.hidden);
        this.weights1 = Matrix.addTwoMatrices(this.weights1, Matrix.dotProductTwoMatrices(hiddenTransposed, outputDeltas))

        //update the weights (add input transpose of layers "dot" hidden deltas)
        let inputsTransposed = Matrix.transposeMatrix(this.inputs);
        this.weights0 = Matrix.addTwoMatrices(this.weights0, Matrix.dotProductTwoMatrices(inputsTransposed, hiddenDeltas))

        //update bias
        this.bias1 = Matrix.addTwoMatrices(this.bias1, outputDeltas);
        this.bias0 = Matrix.addTwoMatrices(this.bias0, hiddenDeltas);
        
    }
}

