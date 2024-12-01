import React from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    CardActions,
} from "@mui/material";

interface DeckCardProps {
    name: string;
    cards: string[];
    onDelete: () => void;
    onUpdate: () => void;
}

const DeckCard: React.FC<DeckCardProps> = ({
    name,
    cards,
    onDelete,
    onUpdate,
}) => {
    return (
        <Card sx={{ maxWidth: 400, margin: 2 }}>
            <CardContent>
                <Typography variant="h6">{name}</Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        marginTop: 2,
                    }}
                >
                    {cards.map((card, index) => (
                        <CardMedia
                            key={index}
                            component="img"
                            src={card}
                            alt={`Card ${index}`}
                            sx={{ width: 60, height: 80 }}
                        />
                    ))}
                </Box>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" onClick={onUpdate}>
                    Update
                </Button>
                <Button variant="outlined" color="error" onClick={onDelete}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default DeckCard;
