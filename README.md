<h1 align="center">Stamp Collection</h1>

## Application location
The proof of concept app is available at [https://michaelfakhri.github.io/stamp-collection/](https://michaelfakhri.github.io/stamp-collection/). Currenlty works in Chrome, Firefox and Opera.

## Description
A simple proof of concept for a peer to peer community that shares stamps using only the browser. Peers can connect to each other, upload, download or query stamps. This only serves as a proof of concept rather than a fully functional app. Peers need to exchange their identities with each other before they can connect to one another.
<br>
<br>
P2P functionality is available by using the [mongo-idb-ds2](https://github.com/michaelfakhri/mongo-idb-ds2) library (which is an extension of the [ds2](https://github.com/michaelfakhri/ds2) library). The [libp2p networking stack](https://github.com/libp2p/js-libp2p) is used for connectivity.
<br>
<br>
The proof of conecpt was built using:
* AngularJS for routing and templating so that it acts like a SPA.
* jQuery for DOM and CSS manipulation.
* Bootstrap for tables and visuals.

## Signalling server
The signalling server is the [libp2p-webrtc-star signalling server](https://github.com/libp2p/js-libp2p-webrtc-star/blob/master/README.md#signalling-server) hosted at blooming-atoll-60728.herokuapp.com (the name is completely arbitrary and was assigned by heroku automatically but was never changed).
