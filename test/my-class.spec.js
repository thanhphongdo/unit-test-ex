const MyClass = require('../services/my-class');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const myObj = new MyClass();

describe('test MyClass', () => {
    it('test add method', () => {
        expect(myObj.add(1, 2)).equal(3);
    });

    it('spy the add method', () => {
        const spy = sinon.spy(myObj, 'add');
        myObj.callAnotherFn(10, 20);
        // sinon.assert.callCount(spy, 2);
        expect(spy.calledWith(10, 20)).to.be.true;
    });
});
