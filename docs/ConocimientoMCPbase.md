Esta solucion es un servidor MCP. Esta pensada para ofrecer asistencia a todo el ciclo de desarrollo de productos software. Tiene armada una estructura para identificar la linea de producto (Lince, Organic y Dragon2028). Ahora quiero empezar a agregar conocimiento para brindar asistencia mediante herramientas, prompts y recursos segun sea lo mas conveniente en cada caso. En cuanto a la codificacion hay un lineamiento base que aplica a todas las lineas. Voy a enumerar estas:

* Los nombres de clases, objetos, funciones y propiedades no deben tener caracteres especiales como ñ, vocales acentuadas o cualquier otro caracter que dependa del idioma.
* Las identaciones deben ser con un caracter tabulador, no con espacios.
* El cuerpo de una clase debe estar identado lo mismo que el cuerpo de una funcion o procedimiento (define class / enddefine, function / endfunc, procedure / endproc)
* En la ejecucion de codigo condicional no puede haber un if que tenga mas de 3 condiciones (If / else / endif con otro condicional dentro), en esos casos hay que usar do case / endcase con cada condicion con un case y dentro puede haber solo un if.
* Los parametros empiezan con la letra t seguido del tipo de datos (c caracter, l logico, d fecha, n numerico, o objeto) y toda variable usada dentro de la funcion debe ser declarada como local (debe estar declarada, puede en algunos casos ser private pero debe estar declarada como minimo local) y empieza con la letra l seguido del tipo de dato (misma nomenclatura como en los parametros)
* Una funcion, procedimiento o metodo no puede tener mas de 50 lineas, debera abrirse en funciones unitarias para evitar exceder el limite. 
* Las identaciones no pueden ser mas de 3 dentro de una funcion, procedimiento o metodo. La identacion corresponde en bloques como if / endif, do case / endcase, for /endfor, try / endtry, with / endwith, etc. Se debera refactorizar en funciones para evitar el exceso de identacion. 
* Las funciones deben tener declarado el tipo de dato de retorno. Si no retorna valor declara Void, en los otros casos se Boolean, String, Number, Object, etc, teniendo una variable local para el retorno que debe declarase segun la misma nomenclatura de las variables locales, llRetorno para Boolean, lcRetorno para String, lnRetorno para Number y loRetorno para Object.

Ahora viene una clasificacion intermedia, de desarrollo en visual foxpro con un framework propio. Este framework tiene convenciones y como caracteristica la generacion de código en base a especificaciones. Los que se basan en este framework son la linea de desarrollo Organic (aplicacion monolitica con sus codigos fuente en la carpeta c:\zoo) y la linea Dragon 2028 (aplicacion modular que consta de soluciones con dovfp con git como control de codigo fuente y por convencion en cualquier carpeta pero todas al mismmo nivel, ejemplo si esta en la carpeta c:\zoogit todas las soluciones estan clonadas en esta carpeta); dichs soluciones son Organic.Core, Organic.Drawing, Organic.Generator, Organic.Feline, Organic.Dragonfish y Organic.ZL.

Estas dos lineas de desarrollo comparten las caracteristicas del framework:

* Las dimensiones y los hechos se construyen mediante una definición que crea entidades con un esquema generado para cada proyecto que estan ubicados una carpeta especifica, la diferencia esta definida por la estructura de carpetas. El Organic para Felino existe la carpeta generados y sigue el mismo patron con el resto, es decir ColorYTAlle\generados, ZL\Generados, Nucleo\generados, etc. Y para Dragon 2028 esta en la carpeta generados como parte de un proyecto Organic.Generated dentro de la solucion, es decir que cada solucion tiene un proyecto Organic.Generated con una carpeta generados dentro.
* La estructura de una aplicación basada en este framework consta de una clases base de la que heredan los distintos tipos de clases. Los servicios son clases globales que pueden accederse desde cualquier entidad; ejemplo de servicios son goCaja, goMensajes y goDatos. Algunas se puede acceder desde goServicios como goServicios.Mensajes y goServicios.Datos. Los componentes son clases que van asociadas a entidades o a ítems que son los elementos de las colecciones en las entidades de hechos. Casos de componentes son oComponenteFiscal y oCompSenias de la entidad factura, oCompCajero del ítem de la coleccion de valores de la factura y oCompPrecios y oCompStock del ítem de la coleccion de articulos de la factura.
* La entidad tiene las reglas de negocio y se genera una clase base con la nomenclatura din_entidad{nombredeentidad} mientras que la capa de presenteacion esta representada por un kontroler que contiene la entidad y tambien es generado con la nomenclatura din_kontroler{nombredeentidad} y contiene la funcionalidad de la capa de presentacion; por ultimo el acceso a datos esta representado por un objeto de la entidad (propiedad oAD) y tambien se genera una base con la nomenclatura din_entidad{nombredeentidad}AD_SQLServer. 
* El esquema de herencia de las entidades son una clase base (entidad.prg), una clase generada con la nomenclatura din_Entidad seguido del nombre de la clase y esta puede heredar directamente de entidad (como el caso de la entidad Cliente) o de una clase intermedia (como el caso de la entidad Factura que hereda de ent_ComprobanteDeVentasConValores.prg)
* Las entidades se generan en base a definiciones que encuentran en Organic dentro de cada carpeta en la carpeta ADN y son archivos dbf. En Dragon 2028 en esta primer etapa en una carpeta adn dentro del proyecto Organic.Generated de cada solucion, pero se migrara a una carpeta xml dentro de la misma adn para tener las definiciones en archivos xml. Si no se encuentra la definicion ahi porque todavia no esta hecha la migracion la puedes encontrar dentro de adn.
* La definicion de la entidad consta de las propiedades de la misma en el archivo Entidad.dbf (para Organic) que se convertira en entidad.xml en Dragon 2028 y tiene la definicion de todas las entidades con su nombre, descripcion y un tipo que es muy importante porque define si en el campo tipo si es una entidad (valor E) o un item (valor I).
* En una relacion uno a muchos la entidad es uno y el item muchos. La diferencia entre entidades de dimensiones y entidades de hechos no tiene una especificacion clara pero todas las entidades heredan de la clase entidad.prg y la mayoria de las de hechos de la clase comprobante.prg.
* En el proyecto Organic dentro de cada carpeta se encuentra una subcarpeta con los modulos. Todas tienen un modulo base (carpeta _base), el resto de los modulos coincide con el nombre de la carpeta. El proyecto Nucleo tiene el módulo data y entidades, el proyecto Dibujante los módulos ClasesVisuales y Formularios, el proyecto Felino los módulos Altas, Caja, Produccon y Ventas y el proyecto ColorYTalle los módulos Alta, Produccion y Ventas. Para Dragon 2028 esto no es necesario respetarlo, pero en una primera etapa de migracio se ha respetado haciendo que cada solucion tenga un proyecto Organic.BussinesLogic y dentro una carpeta CENTRALSS que replica la estructura de Organic, es decir que hay un Organic.BussinesLogic\CENTRALSS\nucleo\_base dentro de la solucion Organic.Core y lo mismo para el resto de las soluciones pero puede redefinirse para una estructura mas moderna.

Lo que sigue son las caracteristicas del framework que comparten ambas lineas de desarrollo:

* Todas las entidades tienen un método para inicializar y otro para liberar los recursos, en ambos se debe primero llamar a la funcion dodefault(). Si en la clase caja se quiere inicializar una instancia de un validador y bindear un evento cambioitem de un detalle al metodo itemcambiado el ejemplo es

        *-----------------------------------------------------------------------------------------
        function Inicializar()
                dodefault()
                this.oValidador = _screen.zoo.CrearObjeto( 'Validador' )
                This.BindearEvento( this.Detalle.oItem, "EventoCambioItem", This, "itemCambiado" )
        endfunc

* El metodo para liberar recursos (Destroy) para esta misma entidad en este mismo caso es:

        *-----------------------------------------------------------------------------------------
        function Destroy() as Void
                dodefault()
                this.oValidador.Release()
        endfunc 

* Siempre que se inicialice un objeto en el metodo inicializar() se debe liberar en el metodo Destroy()

* En las entidades de dimension la clase tipo entidad es la cabecera y la clase tipo item es una coleccion con la que se arma la relacion de uno a muchos.
La estructura de la aplicacion consta de una clases base de la que heredan los distintos tipos de clases. Los servicios son clases globales que pueden accederse desde cualquier entidad; ejemplo de servicios son goCaja, goMensajes y goDatos. Algunas se puede acceder desde goServicios como goServicios.Mensajes y goServicios.Datos. Los componentes son clases que van asociadas a entidades o a items que son los elementos de las colecciones en las entidades de hechos. Casos de componentes son oComponenteFiscal y oCompSenias de la entidad factura, oCompCajero del item de la coleccion de valores de la factura y oCompPrecios y oCompStock del item de la coleccion de articulos de la factura.
* La entidad tiene las reglas de negocio y contiene la capa de presentacion (propiedad oKontroler) y la de acceso a datos (propiedad oAD). 
El esquema de herencia de las entidades son una clase base (entidad.prg), una clase generada con la nomenclatura din_Entidad seguido del nombre de la clase y esta puede heredar directamente de entidad (como el caso de la entidad Cliente) o de una clase intermedia (como el caso de la entidad Factura que hereda de ent_ComprobanteDeVentasConValores.prg)
* Las entidades tienen una estructura para sus operaciones CRUD que son los mÃ©todos Nuevo(), Modificar(), Anular y Eliminar(). La cancelacion del proceso de nuevo o modificar se ejecuta con el metodo Cancelar() y la grabación de los datos de la entidad en edición se hace con el metodo Grabar() que llama primero al metodo AntesDeGrabar(), luego valida los datos con el mÃ©todo Validar(), luego graba los datos y ejecuta un ultimo mÃ©todo Despuesdegrabar().  Todos estos metodos estan en las clases generadas y en las clases base. 
* Las reglas de negocio especÃ­ficas se agregan a la clase especializada que lleva el prefijo ent_, debiendo llamar primero al metodo dodefault(). Para un ejemplo de inicializar la fecha con el dia de hoy en una entidad factura, en la clase ent_factura.prg se agrega el siguiente método:

        *-------------------------------------------------------------------------------------------------
        Function Nuevo() As Boolean
                with This
                        dodefault()
                        .Fecha = date()
                endwith 
        Endfunc

* Otro ejemplo es agregar una validacion al grabar una factura para que el total no sea cero, cuyo ejemplo es:

        *-------------------------------------------------------------------------------------------------
        Function Validar() As boolean
                local llRetorno as Boolean
                With This
                        llRetorno = dodefault()
                        llRetorno = llRetorno and .Total # 0
                endwith
                Return llRetorno
        endfunc

* Las colecciones tienen dos elementos, el detalle (la coleccion en si) y el item (cada uno de los elementos). El detalle herede de detalle.prg y los item de itemactivo.prg
Los generados controlan el acceso (metodo atributo_access) y asignacion (metodo atributo_assign) para aplicar las reglas de negocio. Para escribir reglas de negocio personalizadas se una clase con la convencion de la sigla ent_ seguido del nombre de la entidad. Por ejemplo en el caso de factura la especializacion es ent_factura.prg. 

* Las funciones definen la propiedad que devuelve el valor con la letra l (de variable local) seguida del tipo de dato (c para texto, n para numero, d para fecha, l para logico y o para objeto) y la palabra Retorno; un caso tipo en una validacion que devuelve un valor logico es la variabla local llRetorno. 

* Cada atributo o propiedad tiene un metodo para validad (con la convencion validar_ seguido del nombre del atributo) y un metodo para asignar el valor (con la convencion setear_ seguido del nombre de la propiedad). El metodo que valida recibe como parametro generico el valor a asignar y devuelve un valor booleano verdadero si paso la validacion y falso en caso de que no sea valido. Como en visual foxpro al metodo de la clase padre se llama con el metodo dodefault() en el caso de querer validar que el atributo monto tenga solo dos decimales el uso es 


        *--------------------------------------------------------------
        function Validar_Monto( txVal as variant ) as Boolean
                local llRetorno = dodefault( txVal )
                llRetorno = llRetorno and mod( txVal * 100, 1 )
                Return llRetorno
        endfunc

* Este es el caso en que se quiera validar que el monto cumple con el criterio de tener 2 decimales, pero en el caso de querer aplicar la regla se usa el metodo Setear_ (en lugar de validar) con este modelo 


        *------------------------------------------------
        function Setear_Monto( txVal as variant ) as void

                txVal = round( txVal, 2)
                dodefault( txVal )

        endfunc

* Para las funciones la convencion es tambien que las variables locales se definen con la letra l seguido del tipo (c para texto, n para numero, d para fecha, l para logico y o para objeto) y el nombre. Y los parametros siguen el mismo formato pero empiezan con la letra t en lugar de la l. Un ejemplo de un metodo para obtener el iva sobre un monto es

        *------------------------------------------------------------------------
        function ObtenerIVA( tnMonto as Number, tnPorcentaje as Number) as Number
                local lnRetorno as Number, lnCoeficiente as Number
                lnCoeficiente = tnPorcentaje / 100
                lnRetorno = tnMonto * lnCoeficiente
                return lnRetorno
        endfunc 

* Para enviar un mensaje al usuario se usa el objeto goMensajes siendo el metodo estandar Enviar y el comando goMensajes.Enviar( lcMensaje ). Hay otros tipos de mensajes especificos como el Advertir, Alertar o informar (goMensajes.Advertir(), goMensajes.Alertar() y goMensajes.Informar() respectivamente) y un metodo especial que es el goEnviarSinEsperaProcesando() que se usa para informar al usuario de un proceso y se ejecuta al inicio del proceso con un mensaje como parametro y al final del proceso sin parametro para que cierre el mensaje.
* Las reglas de negocio que se implementen al cargar un comprobante deben hacer uso del método CargaManual() que devuelve si esta en modo edición para permitir ejecutar calculos o validaciones, no en el caso de setear un valor. Un ejemplo es el siguiente que implementa el recalculo de impuestos si detecta un cambio en la situacion fiscal del cliente:

        *--------------------------------------------------------------
        function Setear_SituacionFiscal( txVal as Variant ) as Void
            with This
                if .CargaManual()
                    if vartype( .Cliente ) = "O" and !isnull( .Cliente ) and !empty( .Cliente.Codigo )
                        if .Cliente.SituacionFiscal # txVal
                            .RecalcularImpuestos()
                        endif
                    endif
                endif
            endwith
            dodefault( txVal )
        endfunc



Luego viene la especializacion por linea de desarrollo. La linea Organic:

* El subproyecto Nucleo debe tener los servicios base, el subproyecto Dibujante la interfaz, el subproyecto Generadores genera codigo segun la definicion hecha en tablas dbf de entidades con sus propiedades. El subproyecto Felino tiene las reglas de negocio base para los productos finales, como ColorYTalle y ZL. En este proyecto deben ir las reglas de negocio base y aqui las entidades que se usen en los productos ... no puede ir una entidad en Nucleo o Dibujante porque estan tienen solo la funcionalidad que dan soporte a las entidades usadas en los productos. Por un tema de herencia que permite especializar el comportamiento, si hay una entidad usuario que corresponde agregar reglas ademas de las generadas es con un archivo fuente ent_usuario.prg, si este esta en Felino porque aplica a los dos productos y en ColorYTalle se necesita agrega una especificacion propia del producto y no generica, es a traves del archivo fuente entColorYTalle_usuario.prg que hereda del anterior.
Como ejemplo a definicion del primero es define class ent_usuario as din_entidadusuario of din_entidadusuario.prg y la segunda define class entColorYTalle_usuario.prg as ent_usuario of ent_usuario.prg. Los archivos generados (que comienzan con din_ y terminan con .prg) no deben ser modificados.

La linea Dragon2028 no es monolitica sino que se separa en modulos:

* Los modulos debe ser independientes pero se van construyendo secuencialmente. Organic.Core (heredado de Nucleo) es el modulo base, no depende de ninguno sino que es la base de los servicios y funcionalidades que deben usar los demas. Luego sigue Organic.Drawing (heredado de Dibujante) que usa los servicios que necesita de Organic.Core y define la interfaz de usuario. Organic.Generator (hereda de Generadores) es una bifurcacion para poder generar codigo segun el framework Organic y usa tanto Organic.Core como Organic.Drawing. Luego volvemos a la bifurcacion para seguir con la linea base de productos Organic.Feline (hereda de Felino). Esta linea usa tanto Organic.Core como Organic.Drawing pero no directamente Organic.Generator, solo toma los generados de ese modulo. Llegado a este punto no puede haber referencias cruzadas, ni Organic.Core usar codigo de Organic.Drawing, y ninguno de estos dos puede usar de Organic.Feline. Luego desde este modulo se bifurca en los dos productos finales, Organic.Dragonfish (hereda de ColorYTalle) y Organic.ZL (hereda de ZL)
* La definicion de los proyectos, el diccionario con las entidades y sus atributos, componente como los dominios y relaciones, estan en DBF. En Dragon2028 todo debe pasarse a archivos XML. 
* En estas soluciones habilitamos el uso de comentarios para ser usado en ayuda, asistencia y generacion de codigo. Mediante el uso de NOTE que es un comentario multilinea como primer linea despues de la definicion de una funcion. Estos comentarios siguen la sintaxis de fox de que el simbolo ; indica que continua en la linea siguiente. Ejemplo de uso es:


Function ObtenerNombreCompleto( tnCodigo as Number) as String
NOTE Función para obtener el nombre completo de un usuario ;
	basado en el codigo recibido como parametro. ;
	Si el codigo no existe se lanza una excepcion que debe ser ;
	capturada por la aplicacion
	local lcRetorno as String
	*!* Aqui va el codigo
	return lcRetorno
endfunc

Este comentario multilinea sera usado para ayuda, como busqueda conceptual y lo puede agregar la IA cuando haga un metodo o funcion a solicitud del programador.
* Las propiedades usadas en las entidades (identificadas con this. o en las referencias que dentro de "with this" comiencen con punto (.) deben estar declaradas en el cuerpo de la clase, no depender de que sean creadas por el modulo Organic.Generator


Esta es una primer etapa de implementacion de conocimiento aplicado al proceso de desarrollo. Quiero que diseñes un plan conceptual de implementacion, un resumen del mismo, una guia de implementacion y un plan de desarrollo. Quiero que documentos todo lo anterior que en un archivo markdown con una seccion para cada concepto. Y que armes en otro markdown el plan de ejecucion para que, una vez evaluado, pueda dartelo como prompt para ejecutar el plan.