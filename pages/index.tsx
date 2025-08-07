import {
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  CardActions,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function Home() {
  return (
    <>
      <Stack spacing={2}>
        <Card
          sx={{
            borderRadius: 4,
            p: 2,
            backgroundImage: "url('/yummy-rater_card_background_star.jpg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right bottom",
            backgroundSize: "cover",
          }}
        >
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Get started
            </Typography>
            <Typography variant="body2">
              {`It looks like you don't have any Yummies yet. Start by scanning a
              product and then add it to your Yummies.`}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <IconButton
              sx={{
                width: 60,
                height: 60,
                "& .MuiSvgIcon-root": {
                  fontSize: 35, // Icon-Größe
                },
              }}
              href=""
              color="primary"
              aria-label="jump to scan"
            >
              <ArrowDownwardIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Stack>
    </>
  );
}
