let count = 0
exports.next = function() {
    return ++count
}

exports.hello = function() {
    return "Hellow, World!"
}

/*const s = require('./simple')
s.hello()
s.next() 
console.log(s.console)*/