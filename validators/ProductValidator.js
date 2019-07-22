module.exports = function ValidateProduct(product) {
    let errors = [];
    if (product.name.length <= 3 || product.name.length > 100)
        errors.push({nombre: 'Invalido, debe ser mayor a 3 y menor a 100'});
    if (product.description.length <= 3 || product.name.length > 500)
        errors.push({descripcion: 'Invalido, debe ser mayor a 3 y menor a 500'});
    if (isNaN(product.currentPrice))
        errors.push({precioActual: 'Invalido, debe un numero'});
    if (isNaN(product.originalPrice))
        errors.push({precioOriginal: 'Invalido, debe un numero'});
    if (isNaN(product.availableStock))
        errors.push('Invalido, debe ser un numero')
    if (product.aditionalInfo.length <= 3 || product.aditionalInfo.length > 250)
        errors.push({nombre: 'Invalido, debe ser mayor a 3 y menor a 250'});
    return errors;
}