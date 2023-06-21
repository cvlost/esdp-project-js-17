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
import { Link, useNavigate } from 'react-router-dom';
import { ILocationLink } from '../../../types';
import { apiURL } from '../../../constants';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface Props {
  location: ILocationLink;
  id: string | undefined;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CommercialLinkCard: React.FC<Props> = ({ location, id }) => {
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();

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
              image={apiURL + '/' + location.schemaImage}
              alt={location.addressNote}
            />
          </SwiperSlide>
          <SwiperSlide>
            <CardMedia
              component="img"
              height="300"
              image={apiURL + '/' + location.dayImage}
              alt={location.addressNote}
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
            <Typography paragraph>{location.addressNote ? location.addressNote : 'Информация недоступна'}</Typography>
            <Typography paragraph>{location.description ? location.description : 'Информация недоступна'}</Typography>
            {id && (
              <Button component={Link} size="large" to={`/location/${id}/locationOne/${location._id}`}>
                Подробнее
              </Button>
            )}
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

export default CommercialLinkCard;
