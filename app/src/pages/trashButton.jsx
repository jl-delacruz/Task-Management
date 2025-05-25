// components/GoToTrashButton.js
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function TrashButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/taskTrash');
  };

  return (
    <>
        <Button 
        onClick={handleClick} 
        color="primary"
        variant="contained"

        >Trash
        </Button>
    </>
    
  )
  
  
}

export default TrashButton;
