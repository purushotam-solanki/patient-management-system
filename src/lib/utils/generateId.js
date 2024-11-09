const generateId = (prefix) => {
    if (prefix) {
        return `${prefix}-${Date.now()}${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`
    }
    return `${Date.now()}${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`
}

module.exports = generateId