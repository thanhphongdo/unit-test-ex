module.exports = class MyClass {

    callAnotherFn(arg1, arg2) {
        var result = this.add(arg1, arg2);
        // var result = this.add(arg1, arg2);
        return result;
    }

    add(arg1, arg2) {
        var result;
        result = arg1 + arg2;
        return result;
    }
}