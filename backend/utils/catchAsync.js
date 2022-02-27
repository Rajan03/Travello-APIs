// 1) This function will get async function in argument 
// 2) It returns a function which executes the async function it gets
// 3) Async function returns a promise, which if rejected will be caught here
// 4) Then sent to global error middleware function

module.exports = fxn => (req, res, next) => {
    fxn(req, res, next).catch(next)
}