import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CommercialLinkCard = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Grid item xs={3} sm={4} md={4}>
      <Card sx={{ maxWidth: 345 }}>
        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
          <SwiperSlide>
            <CardMedia
              component="img"
              height="300"
              image="https://i.pinimg.com/originals/8a/de/fe/8adefe5af862b4f9cec286c6ee4722cb.jpg"
              alt="Paella dish"
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardMedia
              component="img"
              height="300"
              image="https://i.pinimg.com/originals/8a/de/fe/8adefe5af862b4f9cec286c6ee4722cb.jpg"
              alt="Paella dish"
            />
          </SwiperSlide>
        </Swiper>
        <CardActions disableSpacing>
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>
              Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken,
              shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp
              to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic,
              tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes.
              Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
            <Button component={Link} size="large" to={'/link/123'}>
              Подробнее
            </Button>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

export default CommercialLinkCard;
