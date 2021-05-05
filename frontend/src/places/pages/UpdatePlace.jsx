import React, { useState, useEffect, useContext} from "react";
import { useParams, useHistory } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from './../../shared/hooks/http-hook';
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from './../../shared/context/auth-context';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "./../../shared/util/validators";

import "./PlaceForm.css";


const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the bigest sky scrapers in the world",
    imageUrl:
      "https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg",
    address: "20 W 34th St, New York, NY 100001",
    location: {
      lat: 40.748433,
      lng: -73.985656,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building building",
    description: "One of the bigest sky scrapers in the world",
    imageUrl:
      "https://www.great-towers.com/sites/default/files/2019-07/tower_0.jpg",
    address: "20 W 34th St, New York, NY 100001",
    location: {
      lat: 40.748433,
      lng: -73.985656,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const {userId} = useContext(AuthContext);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placesId;
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  // const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {
        
      }
      
    }
    fetchPlace();
  }, [sendRequest, setFormData, placeId])


  console.log("formState ", formState);


  const updateSubmitHandler = async (event) => {
    event.preventDefault();
   try {
    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH', JSON.stringify({
      title: formState.inputs.title.value,
      description: formState.inputs.description.value
    }), {
      'Content-Type': 'application/json'
    })
    history.push(`/${userId}/places`);

   } catch (error) {
     
   }
  };



  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
    { isLoading && <LoadingSpinner />}
    {!loadedPlace && !error && (
      <div className="center">
      <Card>
        <h2>Could not find that place</h2>
      </Card>
    </div>
    )}
    {!isLoading && loadedPlace && (
      <form className="place-form" onSubmit={updateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={loadedPlace.title}
        initialValid={true}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description."
        onInput={inputHandler}
        initialValue={loadedPlace.description}
        initialValid={true}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
    )}
    
    </>
  );
};

export default UpdatePlace;
