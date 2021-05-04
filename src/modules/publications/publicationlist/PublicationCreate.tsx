import React, { useState, useEffect, useContext, FormEvent, useRef } from 'react'
import { Button, Col, Form, Spinner } from 'react-bootstrap'

import CredentialsContext from '../../../contexts/CredentialsContext'
import { Category } from '../../../entities/Category'
import api from '../../../api/Api'
import './PublicationTotal.css'
import { Publication } from '../../../entities/Publication'
import { PublicationPostParams, PublicationRepository } from '../repository/PublicationRepository'

export interface PublicationCreateProps {
    visible: boolean,
    setShowCreate: React.Dispatch<React.SetStateAction<boolean>>,
    postPublication: () => void
}

const PublicationCreate = (props: PublicationCreateProps) => {

    const [categories, setCategories] = useState<Category[]>()
    const credentials = useContext(CredentialsContext)

    const [title, setTitle] = useState<string>('')
    const [tags, setTags] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [category, setCategory] = useState<number>(0)
    const [subcategory, setSubcategory] = useState<number>(-1)
    const files = useRef<HTMLInputElement>(null)
    const publicationRepository = new PublicationRepository();

    const handlePost = () => {
        props.postPublication();
        props.setShowCreate(false)
        setTitle(''); setCategory(0); setSubcategory(-1); setTags(''); setDescription('')
    }

    useEffect(() => {
        const searchCategories = async () => {
            const {data} = await api.get('/api/category', {
                headers: {
                    Authorization: `Bearer ${credentials.token}`
                }
            })
            setCategories(data.categories)
        }

        if (credentials.token && !categories)
            searchCategories()

    }, [categories, credentials.token])

    if (!props.visible)
        return (
            <div style={{display: 'none'}}>
            </div>
        )

    if (!categories)
        return (
            <div>
                <Spinner animation="border" />
            </div> 
        )

    const renderCategories = categories.map((category, index) => {
        return (
            <option value={index} key={category.name+index}>{category.name}</option>
        )
    })

    let renderSubcateogries = null
    if (categories[category].children) {
        renderSubcateogries = categories[category].children.map((subcategory, index) => {
            return (
                <option value={index} key={subcategory.name+index}>{subcategory.name}</option>
            )
        })
    }

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault()

        const tagsarray = tags.split(' ')
        let categorypost: string
        if (subcategory === -1)
            categorypost = categories[category].name
        else
            categorypost = categories[category].children[subcategory].name

        const publicationData: PublicationPostParams = {
            title: title,
            category: {name: categorypost},
            tags: tagsarray,
            description: description,
            date: new Date()
        };

        publicationRepository.postPublication(publicationData, credentials.token)
        .then(res => {
            const publication = res.data.publication;
            if (files.current && files.current.files) {
                const filesData = new FormData();
                for (let i = 0; i < files.current.files.length; i++)
                    filesData.append(files.current.files[i].name, files.current.files[i], files.current.files[i].name)
                publicationRepository.postFiles(publication.id, filesData, credentials.token)
                .then(() => handlePost())
                .catch(err => window.alert(err))
                .finally(() => {})
            }
            else handlePost()
        })
        .catch(err => window.alert(err))
        .finally(() => {});

    }

    return (
        <div className="publication-form">
            <div className="create-form">
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" value={title} onChange={e => setTitle(e.target.value)}/>
                    </Form.Group>

                    <Form.Row>
                        <Form.Group as={Col} controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select" value={category} onChange={(e) => {setCategory(parseInt(e.target.value))}}>
                            {renderCategories}
                        </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="subcategory">
                        <Form.Label>Subcategory</Form.Label>
                        <Form.Control as="select" value={subcategory} onChange={(e) => {setSubcategory(parseInt(e.target.value))}}>
                            <option value={-1}>Seleccionar subcategoria</option>
                            {renderSubcateogries}
                        </Form.Control>
                        </Form.Group>

                    </Form.Row>

                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <Form.Control type="text" placeholder="Tags" value={tags} onChange={e => setTags(e.target.value)}/>
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={4} value={description} onChange={e => setDescription(e.target.value)}/>
                    </Form.Group>

                    <Form.Group controlId="files">
                        <Form.Label>Files</Form.Label>
                        <Form.File id="files" multiple={true} ref={files} accept="application/pdf,video/mp4,image/jpg,image/jpeg,image/png"/>
                    </Form.Group>

                    <Button variant="primary" type="submit" style={{marginRight: '1em'}}>
                        Submit
                    </Button>
                    <Button variant="primary" type="button" onClick={() => props.setShowCreate(false)}>
                        Cancel
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default PublicationCreate