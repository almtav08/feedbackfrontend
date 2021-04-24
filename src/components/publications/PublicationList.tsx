import React, { useState, useEffect, useContext } from 'react'

import { Publication } from '../../entities/Publication'
import PublicationCard from './PublicationCard'
import './PublicationTotal.css'
import api from '../../api/Api'
import CredentialsContext from '../../contexts/CredentialsContext'
import { Button, Pagination } from 'react-bootstrap'
import PublicationCreate from './PublicationCreate'
import CategoryMenu from './CategoryMenu'

const PublicationList = () => {

    const [publications, setPublications] = useState<Array<Publication>>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [finalSearchTerm, setFinalSearchTerm] = useState<string>('')
    const [cursor, setCursor] = useState<number>(-1)
    const [showCreate, setShowCreate] = useState<boolean>(false)
    const [selected, setSelected] = useState(-2)
    const [itemSize, setItemsize] = useState<number>(0)
    const [isLast, setIslast] = useState<boolean>(false)
    const [prevCursors, setPrevcursors] = useState<number[]>([])

    const credentials = useContext(CredentialsContext)

    useEffect(() => {
        const time = setTimeout( () => {
            setFinalSearchTerm(searchTerm)
        }, 500)

        return () => {
            clearTimeout(time)
        }
    }, [searchTerm])

    useEffect(() => {
        const searchPublications = async () => {

            let url: string = '/api/publication'
            if (selected === -1)
                url = '/api/publication/expert'
            else if (selected >= 0)
                url = `/api/publication/category/${selected}`

            const {data} = await api.get(url, {
                params: {
                    cursor: cursor,
                    filter: finalSearchTerm
                },
                headers: {
                    Authorization: `Bearer ${credentials.token}`
                }
            })

            setPublications(data.publications)
            setItemsize(data.itemSize)
            setIslast(data.leftSize === 0)
        }

        if (credentials.token)
            searchPublications()

    }, [finalSearchTerm, cursor, credentials.token, selected])

    const pubs = publications.map((publication) => {
        return (
            <div key={publication.id}>
                <PublicationCard publication={publication} />
            </div>
        )
    })

    const postPublication = (publication: Publication) => {
        const newpublications = [publication, ...publications]
        newpublications.pop()
        setPublications(newpublications)
    }

    const renderPost = () => {
        if (credentials.usertype === 'apprentice')
            return (
                <div className="add-publication">
                    <Button onClick={() => {setShowCreate(!showCreate)}}>
                    Post your publication
                    </Button>  
                </div>
            )
    }

    const searchNext = () => {
        if (!isLast) {
            const newCursor = publications[0].id + 1
            setPrevcursors([...prevCursors, newCursor])
            setCursor(publications[itemSize - 1].id)
        }
    }

    const searchPrev = () => {
        if (cursor !== -1 && prevCursors.length > 0) {
            const newCursor = prevCursors[prevCursors.length - 1]
            const newprevcursors = [...prevCursors]
            newprevcursors.pop()
            setCursor(newCursor)
            setPrevcursors(newprevcursors)
        }
    }

    return (
        <div>
            <div className="ui form">
                <div className={`ui fluid icon input ${credentials.usertype === 'apprentice' ? 'posting' : ''}`}>
                    <input value={searchTerm} placeholder="Search publications" 
                    type="text" className="input" onChange={e => setSearchTerm(e.target.value)}/>  
                    <i className="search icon"></i>
                </div>
                {renderPost()}
            </div>
            <CategoryMenu setSelected={setSelected} selected={selected}/>
            <div className="publication-list">
                {pubs}
            </div>
            <div className="pagination">
                <Pagination>
                    <Pagination.Prev onClick={searchPrev}/>
                    <Pagination.Next onClick={searchNext}/>
                </Pagination>
            </div>
            <PublicationCreate visible={showCreate} setShowCreate={setShowCreate} postPublication={postPublication}/>
        </div>
    )
}

export default PublicationList