import React, { FunctionComponent } from 'react'
import { Spinner } from 'react-bootstrap'
import FavouriteCategoryCard from '../../components/cards/FavouriteCategoryCard'
import { CategoryRaw } from '../../entities/Category'
import './FavCategories.css'

interface FavCategoriesInfoProps {
    handleFav: (id: number) => void,
    categories: CategoryRaw[] | undefined,
    favIds: number[] | undefined
}

const FavCategoriesInfo: FunctionComponent<FavCategoriesInfoProps> = (
    {
        handleFav,
        categories,
        favIds
    }
) => {

    if (!categories || !favIds)
        return <div><Spinner animation="border" /></div>

    const renderCategories = categories.map((category) => {
        return <FavouriteCategoryCard
            key={category.id}
            category={category}
            favIds={favIds}
            handleFav={handleFav} />
    })

    return (
        <div className="favourites-list">
            {renderCategories}
        </div>
    )
}

export default FavCategoriesInfo