import React, { FunctionComponent, useContext } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from 'react-bootstrap'

import CredentialsContext from '../../../contexts/CredentialsContext'
import './PublicationInfoTotal.css'
import { PublicationRepository } from '../repository/PublicationRepository'

export interface FilesInfoProps {
    files: string[]
}

const mymes: { [extension: string]: string }  = {
    jpg: 'image/jpg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    pdf: 'application/pdf',
    mp4: 'video/mp4'
}

const FilesInfo: FunctionComponent<FilesInfoProps> = (
    {
        files
    }
) => {

    const credentials = useContext(CredentialsContext)
    const repository = new PublicationRepository();

    pdfjs.GlobalWorkerOptions.workerSrc = 
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

    const dowloandFile = (filename: string) => {

        const extension = filename.split('.')
        const type = extension[extension.length - 1]
        const filetype = mymes[type]

        repository.getFile(filename, credentials.token)
        .then(res => {
            let file = new File([res.data], filename, {type: filetype})
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(file)
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
        })
        .catch(err => window.alert(err))
        .finally(() => {})
    }

    const getFilename = (filename: string) => {
        const fileparts = filename.split('-')
        const extension = filename.split('.')
        const type = extension[extension.length - 1]
        let name = ''
        for (let i = 0; i < fileparts.length - 1; i++) {
            if (i !== 0)
                name += '-'
            name += fileparts[i]
        }
        name += '.' +type
        if (name.length > 20)
            name = name.substr(0,20) + '...'
        return name
    }

    const renderimage = (image: string) => {
        return (
            <div className="file-info">
                <img src={`https://feedback-heroku.herokuapp.com/api/public/file/${image}`} 
                    alt={image} id={image} width="100%" height="100%"/>
            </div>
        )
    }

    const rendervideo = (video: string) => {
        return (
            <div className="file-info">
                <video src={`https://feedback-heroku.herokuapp.com/api/public/file/${video}`} 
                    id={video} width="100%" height="100%"/>
            </div>
        )
    }

    const renderdocument = (document: string) => {
        return (
            <div style={{height: "9em", overflow: 'hidden'}}>
                <Document file={`https://feedback-heroku.herokuapp.com/api/public/file/${document}`} 
                    onLoadSuccess={() => {}}>
                <Page pageNumber={1} width={250} className="file-pdf"/>
                </Document>
            </div>
        )
    }

    const renderallfiles = files.map((file) => {
        const split = file.split('.')
        let renderdownload
        if (split[split.length - 1] === 'pdf')
            renderdownload = renderdocument(file)
        else if (split[split.length - 1] === 'mp4')
            renderdownload = rendervideo(file)
        else
            renderdownload = renderimage(file)
        return (
            <Button variant="light" onClick={() => dowloandFile(file)} key={file} className="file-preview">
                {renderdownload}
                <div className="file-description">
                    {getFilename(file)}
                </div>
                <div className="file-download">
                    <i className="download icon"></i>
                </div>
            </Button>
        )
    })

    return (
        <div>
            {renderallfiles}
        </div>
    )

}

export default FilesInfo