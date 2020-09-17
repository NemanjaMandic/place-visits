import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";

import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openMap = () => setShowMap(true);
  const closeMap = () => setShowMap(false);
  const showDeleteHandler = () => setShowDeleteModal(true);
  const cancelDeleteHandler = () => setShowDeleteModal(false);
  const confirmDeleteHandler = () => console.log("deleted");
  const {
    id,
    image,
    title,
    description,
    address,
    creatorId,
    coordinates,
  } = props;

  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMap}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMap}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>{" "}
            <Button danger onClick={confirmDeleteHandler}>
              CONFIRM
            </Button>
          </>
        }
      >
        <p>Do you want to delete this place?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={image} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMap}>
              VIEW ON MAP
            </Button>
            {isLoggedIn && (
              <>
                <Button to={`/places/${id}`}>EDIT</Button>
                <Button danger onClick={showDeleteHandler}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
