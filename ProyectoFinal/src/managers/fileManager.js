import fs from 'fs'
import path from 'path'


class FileManager {
    constructor(fileName){
        this.fileName=fileName
        
    }

    save = async(newProduct) => {
        try{
            console.log('Path: '+this.fileName)
            if(fs.existsSync(this.fileName))
            {   
                let productos 
                let lastIdAdded
                try{
                    productos =  await this.getAll()                    
                    lastIdAdded = productos.reduce((acc,item)=> item.id > acc ? acc = item.id : acc,0);
                    console.log('Ultimo añadido: '+lastIdAdded)
                }catch(error){
                    lastIdAdded=0;
                }
                const newId = lastIdAdded+1
                const newProductToAdd = {
                    id: newId,
                    ...newProduct
                } 
                console.log('Producto a añadir: '+newProductToAdd.id)
                if (productos ===-1){
                    productos = [newProductToAdd]
                    console.log('Cuando estavacio: '+JSON.stringify(productos))
                }else{                     
                    
                    console.log('Longitud: '+ productos.length)
                    productos.push(newProductToAdd)
                }
                
                await fs.promises.writeFile(this.fileName,JSON.stringify(productos,null,2))
                return productos;
            }else {
                const newProductToAdd={
                    id:1,
                    ...newProduct                  
                }
                await fs.promises.writeFile(this.fileName,JSON.stringify([newProductToAdd],null,2))


            }
        }catch(error){
            console.error(error);
        }

    }

    getById = async(id) => {
        try{
            const productos = await this.getAll();
            console.log(id)           
            const producto = productos.find(item=>item.id===id);
            return producto
        }catch(error){
            console.error(error)
        }
    }

    getAll = async() =>{
        try {
        const contenido = await fs.promises.readFile(this.fileName,"utf8")
        const productos = JSON.parse(contenido)
        return productos;
        }
        catch(error){
            return -1
            
        }
    }

    deleteById = async(id) => {
        try{
            const productos = await this.getAll()
            const newProducts = productos.filter(item => item.id!==parseInt(id))
            await fs.promises.writeFile(this.fileName, JSON.stringify(newProducts,null,2))


        }catch(error){
            console.log(error)
        }
    }

    deleteAll = async() => {
        try{
            await fs.promises.writeFile(this.fileName,JSON.stringify([]));
        }catch(error){
            console.log(error)

        }
    }

    updateById = async(id, body)=>{
        try {
            console.log('ID: '+id +'Body: '+body.productos)
            const productos = await this.getAll();
            const productPos = productos.findIndex(elm=>elm.id === parseInt(id));
            console.log(productos + ' Posicion: '+productPos)
            productos[productPos] = {
                id:id,
                ...body
            };
            await fs.promises.writeFile(this.fileName, JSON.stringify(productos, null, 2))
            return productos;
        } catch (error) {
            console.log(error)
        }
    }

}

export {FileManager}