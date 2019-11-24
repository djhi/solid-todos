import { useEffect, useState } from 'react';
import { TripleDocument, TripleSubject } from 'tripledoc';
import { fetchDocument } from 'tripledoc';
import { solid } from 'rdf-namespaces';
import useProfile from './useProfile';

const usePublicTypeIndex = () => {
	const [publicTypeIndex, setPublicTypeIndex] = useState<TripleDocument>();
	const profile = useProfile();

	useEffect(() => {
		if (!profile) {
			return;
		}
		(async () => {
			const fetchedPublicTypeIndex = await fetchPublicTypeIndex(profile as TripleSubject);

			if (fetchedPublicTypeIndex) {
				setPublicTypeIndex(fetchedPublicTypeIndex);
			}
		})();
	}, [profile]);

	return publicTypeIndex;
};

export default usePublicTypeIndex;

export const fetchPublicTypeIndex = async (profile: TripleSubject) => {
	const publicTypeIndexUrl = profile.getRef(solid.publicTypeIndex);
	if (!publicTypeIndexUrl || typeof publicTypeIndexUrl !== 'string') {
		return null;
	}
	const document = await fetchDocument(publicTypeIndexUrl);
	return document;
};
