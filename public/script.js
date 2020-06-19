
// masks
const Mask = {
    apply(input, func) {
        setTimeout(() => {
            input.value = Mask[func](input.value)        
        }, 1);
    },

    formatBRL(value) {
        value = value.replace(/\D/g,"")
        return value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)
    },

    cpfCnpj(value) {
        value = value.replace(/\D/g,"")

        // removing last number
        if(value.length > 14) value = value.slice(0, -1)
            
        
        // check is cnpj - 11.222.333/4444-55
        if(value.length > 11) {

            // 11.222333444455
            value = value.replace(/(\d{2})(\d)/, '$1.$2')

            // 11.222.333444455
            value = value.replace(/(\d{3})(\d)/, '$1.$2')

            // 11.222.333/444455
            value = value.replace(/(\d{3})(\d)/, '$1/$2')

            // 11.222.333/4444-55
            value = value.replace(/(\d{4})(\d)/, '$1-$2')
            
        } else { // cpf 
            // 123.45678900
            value = value.replace(/(\d{3})(\d)/, '$1.$2')

            // 123.456.78900
            value = value.replace(/(\d{3})(\d)/, '$1.$2')

            // 123.456.789-00
            value = value.replace(/(\d{3})(\d)/, '$1-$2')
        }

        return value
    },

    cep(value) {
        // cep - 99999999
        value = value.replace(/\D/g, '')

        // removing last number
        if(value.length > 8) value = value.slice(0, -1)

        // 99999-999
        value = value.replace(/(\d{5})(\d)/, '$1-$2')

        return value
    }
}

// image manager - upload
const PhotosUpload = {
    input: '',
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],

    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
      
        if(PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)
            
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image() 
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if(fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == 'photo') {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit) {
            alert(`Você está tentando inserir ${totalPhotos} fotos, o máximo são 6!`)
            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles() {
        // ClipboardEvent - for mozilla
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)
        div.appendChild(PhotosUpload.getRemoveButton())
        return div
    },

    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    // remove on the front - moment of the post
    removePhoto(event) {
        const photoDiv = event.target.parentNode 
        const photosArray = Array.from(PhotosUpload.preview.children)

        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    // remove on front and back - update time
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if(removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()
    }
}

// image gallery
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => {
            preview.classList.remove('active')
        })

        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    },
}

// lightbox
const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.litghtbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = '-100%'
        Lightbox.target.style.bottom = 'initial'
        Lightbox.closeButton.style.top = '-80px'

    }

}

// validade - email
const Validade = {
    apply(input, func) {  
        let results = Validade[func](input.value) 
        input.value = results.value

        if(results.error)
            alert('ERROOUU!!!')
    },

    isEmail(value) {
        let error = null
        
        // regular expression for e-mail
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        return {
            error,
            value
        }
    }
}

