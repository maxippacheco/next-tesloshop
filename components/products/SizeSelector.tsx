import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";
import { ISize } from "../../interfaces";

interface Props {
	selectedSize?: ISize;
	sizes: ISize[];


	onSelectedSize: ( size: ISize ) => void;
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {
	return (
		<Box>
			{
				sizes.map(size => (
					<Button
						onClick={ () => onSelectedSize( size ) }
						key={ size } 
						size="small"
						color={ selectedSize === size ? 'primary' : 'info' }
					>
						{ size }
					</Button>
				))
			}
		</Box>
	)
}
