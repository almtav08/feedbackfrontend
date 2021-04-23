import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Badge, Button, Spinner } from 'react-bootstrap'
import { Document, Page, pdfjs } from 'react-pdf'

import CredentialsContext from '../../contexts/CredentialsContext'
import { Publication } from '../../entities/Publication'
import api from '../../api/Api'
import './PublicationInfo.css'
import moment from 'moment'
import PublicationFeedbacks from './PublicationFeedbacks'

type PublicationInfoParams = {id: string}

const PublicationInfo = ({match}: RouteComponentProps<PublicationInfoParams>) => {

    const [publication, setPublication] = useState<Publication>()
    const credentials = useContext(CredentialsContext)
    const [showCreate, setShowCreate] = useState<boolean>(false)

    pdfjs.GlobalWorkerOptions.workerSrc = 
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

    useEffect(() => {
        const searchPublication = async () => {
            const {data} = await api.get(`/api/publication/${match.params.id}`, {
                headers: {
                    Authorization: `Bearer ${credentials.token}`
                }
            })

            setPublication(data.publication)
        }

        if (credentials.token && !publication)
            searchPublication()
            
    }, [publication, credentials.token, match.params.id])
    
    if (!publication)
        return (
            <div className="loading">
                <Spinner animation="border" />
            </div> 
        )

    const mymes: { [extension: string]: string }  = {
        jpg: 'image/jpg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        pdf: 'application/pdf',
        mp4: 'video/mp4'
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

    const dowloandFile = (filename: string) => {

        const extension = filename.split('.')
        const type = extension[extension.length - 1]
        const filetype = mymes[type]

        api.get(`/api/file/${filename}`, {
            headers: {
                Authorization: `Bearer ${credentials.token}`
            },
            responseType: 'blob'
        }).then(response => {
            let file = new File([response.data], filename, {type: filetype})
            const url = window.URL.createObjectURL(file);
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
        })
    }

    const renderimages = publication.images.map((image) => {
        return (
            <Button variant="light" onClick={() => dowloandFile(image)} key={image} className="file-preview">
                <div className="file-info">
                    <img src={`https://feedback-heroku.herokuapp.com/api/public/file/${image}`} alt={image} id={image} width="100%" height="100%"/>
                </div>
                <div className="file-description">
                    {getFilename(image)}
                </div>
                <div className="file-download">
                    <i className="download icon"></i>
                </div>
            </Button>
        )
    })

    const rendervideos = publication.video.map((video) => {
        return (
            <Button variant="light" onClick={() => dowloandFile(video)} key={video} className="file-preview">
                <div className="file-info">
                    <video src={`https://feedback-heroku.herokuapp.com/api/public/file/${video}`} id={video} width="100%" height="100%"/>
                </div>
                <div>
                    {getFilename(video)}
                </div>
                <div className="file-download">
                    <i className="download icon"></i>
                </div>
            </Button>
        )
    })

    const renderfiles = publication.document.map((document) => {
        return (
            <Button variant="light" onClick={() => dowloandFile(document)} key={document} className="file-preview">
                <div style={{height: "9em", overflow: 'hidden'}}>
                    <Document file={`https://feedback-heroku.herokuapp.com/api/public/file/${document}`} onLoadSuccess={() => {}}>
                    <Page pageNumber={1} width={250} className="file-pdf"/>
                    </Document>
                </div>
                <div>
                    {getFilename(document)}
                </div>
                <div className="file-download">
                    <i className="download icon"></i>
                </div>
            </Button>
        )
    })

    const renderTags = publication.tags.map((tag) => {
        return (
            <span className="render-tags" key={tag}>
            <Badge variant="secondary">{tag}</Badge>
            </span>
        )
    })

    const renderPostFeedback = () => {
        if (credentials.usertype === 'expert')
            return (
                <div className="item">
                <Button onClick={() => setShowCreate(!showCreate)}>
                    Give feedback
                </Button>
                </div>
            )
    }

    return (
        <div>
            <div className="ui header">
                <h1>{publication.title}</h1>
            </div>
            <hr />
            <div className="content">
                <div className="comment">
                    <div className="content">
                        <div className="text">{publication.description}</div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="comment">
                    <div className="content">
                        <div className="text tags">{renderTags}</div>
                    </div>
                </div>
            </div>
            <br />
            <div>
                {renderfiles}
                {renderimages}
                {rendervideos}
            </div>
            <br />
            <div className="user-tag">
                <h3>
                    <Badge variant="info">
                        <div>
                            <p style={{fontSize: '0.6em'}}>
                                {moment(publication.date).format('D MMM YYYY HH:mm:ss')}
                            </p>
                        </div>
                        <div>
                            <p style={{fontSize: '0.8em'}}>
                                {publication.apprentice.username}
                            </p>
                        </div>
                    </Badge>
                </h3>
            </div>
            <br />
            <div className="ui secondary pointing menu">
                <div className="item">
                    <h1>Respuestas</h1>
                </div>
                <div className="right menu">
                {renderPostFeedback()}
                </div>
            </div>
                <PublicationFeedbacks id={publication.id} visible={showCreate} setShowCreate={setShowCreate}/>
        </div>
    )
}

export default PublicationInfo