var productos = [
    {
        codigo: "A1",
        nombre: "Arroz blanco",
        cantidad: 132,
        precioSinIva: 5.36,
        iva: 0.64,
        precioTotal: 6
    },
    {
        codigo: "A2",
        nombre: "Pan Sandwich",
        cantidad: 351,
        precioSinIva: 15,
        iva: 0.5,
        precioTotal: 15.5
    }
];

var esNuevo = false;

function ObtenerProductos()
{
    let tabla = document.querySelector("table");
    let tbody = document.querySelector("tbody");

    tabla.removeChild(tbody);

    tbody = document.createElement("tbody");

    tabla.appendChild(tbody);

    for(let producto of productos)
    {
        try{
        let row = document.createElement("tr");
        tbody.appendChild(row);
        
        let codigo = document.createElement("td");
        let nombre = document.createElement("td");
        let cantidad = document.createElement("td");
        let precioSinIva = document.createElement("td");
        let iva = document.createElement("td");
        let precioTotal = document.createElement("td");
        let opciones = document.createElement("td");
        
        // OPCIONES 
        let btnEditar = document.createElement("button");
        btnEditar.setAttribute("class", "btn btn-success mx-1 btnEditar");
        btnEditar.setAttribute("data-toggle", "modal");
        btnEditar.setAttribute("data-target", "#modal");
        let iconEditar = document.createElement("i");

        iconEditar.setAttribute("class", "fa fa-edit");
        btnEditar.setAttribute("id", producto.codigo);
        btnEditar.innerHTML = iconEditar.outerHTML;

        let btnEliminar = document.createElement("button");
        btnEliminar.setAttribute("class", "btn btn-danger mx-1 btnEliminar");
        let iconEliminar = document.createElement("i");

        iconEliminar.setAttribute("class", "fa fa-trash");
        btnEliminar.setAttribute("id", producto.codigo);
        btnEliminar.innerHTML = iconEliminar.outerHTML;

        opciones.innerHTML = btnEditar.outerHTML + btnEliminar.outerHTML;


        codigo.innerHTML = producto.codigo;
        nombre.innerHTML = producto.nombre;
        cantidad.innerHTML = producto.cantidad;
        precioSinIva.innerHTML = "Q " + producto.precioSinIva.toFixed(2);
        iva.innerHTML = "Q " + producto.iva.toFixed(2);
        precioTotal.innerHTML = "Q " + producto.precioTotal.toFixed(2);

        row.appendChild(codigo);
        row.appendChild(nombre);
        row.appendChild(cantidad);
        row.appendChild(precioSinIva);
        row.appendChild(iva);
        row.appendChild(precioTotal);
        row.appendChild(opciones);

        


        }catch(ex)
        {
            console.error(ex);
        }
    }

}


function CrearProducto()
{
    let producto = ObtenerObjetoGuardado();
    let validacion = Validar(producto);
    if(!validacion.resultado)
    {
        alert(validacion.mensaje);
        return;
    }
    productos.push(producto);
    ObtenerProductos();
    ActivarEdicion();
    ActivarEliminar();
}

function EditarProducto()
{
    let producto = ObtenerObjetoGuardado();
    let validacion = Validar(producto);

    if(!validacion.resultado)
    {
        alert(validacion.mensaje);
        return;
    }

    let productoAnterior = productos.find(el => el.codigo == producto.codigo);

    let index = productos.indexOf(productoAnterior);

    if(index !== -1)
        productos[index] = producto;
    
    ObtenerProductos();
    ActivarEdicion();
    ActivarEliminar();
}

function EliminarProducto(codigo)
{
    let producto = productos.find(el => el.codigo == codigo) || -1;

    if(producto === -1)
        return;

    let index = productos.indexOf(producto);
    productos.splice(index, 1);
    ObtenerProductos();
    ActivarEdicion();
    ActivarEliminar();
}

function ObtenerProducto(codigo)
{
    return productos.find(el => el.codigo == codigo);
}

function LlenarFormulario(limpiar, producto = {})
{
    document.querySelector("#codigo").value = (limpiar ? "" : producto.codigo);
    document.querySelector("#nombre").value = (limpiar ? "" : producto.nombre);
    document.querySelector("#cantidad").value = (limpiar ? "" : producto.cantidad);
    document.querySelector("#precioSinIva").value = (limpiar ? "" : producto.precioSinIva);
}

function ObtenerObjetoGuardado()
{
    let precioSinIva =  Number.parseFloat(document.querySelector("#precioSinIva").value);
    return producto = {
        codigo: document.querySelector("#codigo").value,
        nombre: document.querySelector("#nombre").value,
        cantidad: Number.parseFloat(document.querySelector("#cantidad").value),
        precioSinIva: precioSinIva,
        iva: precioSinIva * 0.12,
        precioTotal: (precioSinIva * 0.12) + precioSinIva,
    }
}

function Validar(producto)
{
    try
    {

        let find = productos.find(el => el.codigo == producto.codigo) || -1;

        if(find !== -1 && esNuevo)
            throw "Ya existe el producto";
        
        let cantidad = parseFloat(producto.cantidad);
        let precioSinIva = parseFloat(producto.precioSinIva);

        return {
            resultado: true,
            mensaje: "Producto válido"
        }
    }
    catch (ex)
    {
        return {
            resultado: false,
            mensaje: ex
        }
    }
}

document.querySelector("#btnGuardar").addEventListener("click", () => {

    if(esNuevo)
        CrearProducto();
    else
        EditarProducto();
});

document.querySelector("#nuevo").addEventListener("click", () =>
    {
        esNuevo = true;
        LlenarFormulario(true);
        document.querySelector("#codigo").removeAttribute("disabled");
    }
);

function ActivarEdicion()
{
    for(let i = 0; i < document.getElementsByClassName("btnEditar").length; i++)
    {
        let input = document.getElementsByClassName("btnEditar")[i];
        input.addEventListener("click", (id) => {
            
            esNuevo = false;
            LlenarFormulario(true);
            let producto = ObtenerProducto(input.id);
            LlenarFormulario(false, producto);
        
            document.querySelector("#codigo").setAttribute("disabled", "disabled");
        });
    }
}

function ActivarEliminar()
{
    for(let j = 0; j < document.getElementsByClassName("btnEliminar").length; j++)
    {
        let inputEl = document.getElementsByClassName("btnEliminar")[j];
        inputEl.addEventListener("click", () => {
            EliminarProducto(inputEl.id);
        })
    }
}

document.querySelector("#searchProducto").addEventListener("click", () => {
    let producto = ObtenerProducto(document.querySelector("#inputBuscar").value);

    if(producto)
    {
        document.querySelector("#txtNombre").innerHTML = producto.nombre;
        document.querySelector("#txtCantidad").innerHTML = producto.cantidad;
        document.querySelector("#txtPI").innerHTML = "Q " + producto.precioSinIva.toFixed(2);
        document.querySelector("#txtIVA").innerHTML ="Q " + producto.iva.toFixed(2);
        document.querySelector("#txtPT").innerHTML = "Q " + producto.precioTotal.toFixed(2);
    }
});


ObtenerProductos();
ActivarEdicion();
ActivarEliminar();
