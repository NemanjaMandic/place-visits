import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the bigest sky scrapers in the world',
        imageUrl: 'https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg',
        address: '20 W 34th St, New York, NY 100001',
        location: {
            lat: 40.748433,
            lng: -73.985656
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building building',
        description: 'One of the bigest sky scrapers in the world',
        imageUrl: 'https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg',
        address: '20 W 34th St, New York, NY 100001',
        location: {
            lat: 40.748433,
            lng: -73.985656
        },
        creator: 'u2'
    }
];

const UserPlaces = () => {
  
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId)
    return <PlaceList items={loadedPlaces} />
}
 
export default UserPlaces;