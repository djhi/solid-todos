import React from 'react';
import { Flex, FlexProps } from '@chakra-ui/core';

const MaxWidthContainer = (props: FlexProps) => (
	<Flex
		maxWidth={['containers.sm', 'containers.md', 'containers.lg', 'containers.xl']}
		minWidth={['containers.sm', 'containers.md', 'containers.lg', 'containers.xl']}
		mx="auto"
		{...props}
	/>
);

export default MaxWidthContainer;
