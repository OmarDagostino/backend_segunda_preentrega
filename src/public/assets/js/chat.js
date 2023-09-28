console.log('OK')

const socket= io ()

let email='';
let divMensajes = document.getElementById('mensajes');
let inputMensajes= document.getElementById('mensaje');

inputMensajes.addEventListener('keyup',evt=> {
    if (evt.key==='Enter') {
        if (evt.target.value.trim()!=='') {
            socket.emit ('nuevoMensaje', {user:email, message:evt.target.value.trim()})
            evt.target.value=''
            inputMensajes.focus()
        }
    }
})

Swal.fire({
    title: "Identifíquese",
    input: "text",
    text: "Ingrese su e-mail",
 
    inputValidator: (value) => {
        if (!value) {
        return 'Debes ingresar una dirección de correo electrónico';
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
        return 'Ingresa una dirección de correo electrónico válida';
        }
        },
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                email=resultado.value,
                document.title=email,
                inputMensajes.focus(),
                socket.emit ('id', email)
            }
        
            socket.on ('bienvenida',mensajes =>{
                    let txt = ''
                    mensajes.forEach(mensaje=> {
                        txt+= (`<p class="mensaje"> <strong> ${mensaje.user} </strong> : <i> ${mensaje.message} </i> </P> <br> `)
                    })
                    divMensajes.innerHTML = txt
                    divMensajes.scrollTop = divMensajes.scrollHeight;

                } )

            socket.on ('nuevoUsuario',email =>{
                Swal.fire ({
                    text: `Se ha conectado ${email}`,
                    toast:true,
                    position:"top-right"
                })

            } )

            socket.on ('desconeccion',email =>{
                Swal.fire ({
                    text: `Se ha desconectado el usuario ${email}`,
                    toast:true,
                    position:"top-right"
                })

            } )


            socket.on ('llegoMensaje', mensaje => {
                let txt = ''
                
                txt+= (`<p class="mensaje"> <strong> ${mensaje.user} </strong> : <i> ${mensaje.message} </i> </P> <br> `)
            
                divMensajes.innerHTML += txt
                divMensajes.scrollTop = divMensajes.scrollHeight;
            })
   })

