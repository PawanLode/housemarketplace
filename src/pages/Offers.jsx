import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { async } from '@firebase/util';
import ListingItem from '../components/ListingItem';

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = collection(db, 'listings');
        console.log({listingRef});

        // create a queryf
        const q = query(
          listingRef,
          where('offer', '==', true),
          orderBy('timestamp'),
          limit(10)
        );
        //   execute the query
        const querySnap = await getDocs(q);
        console.log({ querySnap });
        let listings = [];
        querySnap.forEach((doc) => {
          console.log("ehllo",doc.data());
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error('could not fetch listing');
      }
    };
    fetchListing();
  }, []);
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
       Offers
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((list) => {
                console.log({ list });
                return (
                  <ListingItem listing={list.data} id={list.id} key={list.id} />
                );
              })}
            </ul>
          </main>
        </>
      ) : (
        <p>No listing Offers</p>
      )}
    </div>
  );
};

export default Offers;
