import React from 'react';
import { TripleSubject } from 'tripledoc';
import solidAuth from 'solid-auth-client';
import { fetchDocument } from 'tripledoc';

const useProfile = () => {
	const [profile, setProfile] = React.useState<TripleSubject>();

	React.useEffect(() => {
		fetchProfile().then(fetchedProfile => {
			if (fetchedProfile === null) {
				return;
			}
			setProfile(fetchedProfile);
		});
	}, []);

	return profile;
};

export default useProfile;

const fetchProfile = async () => {
	const currentSession = await solidAuth.currentSession();
	if (!currentSession) {
		return null;
	}

	const webIdDoc = await fetchDocument(currentSession.webId);
	const profile = webIdDoc.getSubject(currentSession.webId);
	return profile;
};
