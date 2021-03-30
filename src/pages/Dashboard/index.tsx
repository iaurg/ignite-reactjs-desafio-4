import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

type FoodType = {
  id: number
  name: string
  description: string
  price: string
  available: boolean
  image: string
}

const Dashboard = () => {
  /*
  constructor(props) {
    super(props);
    this.state = {
      foods: [],
      editingFood: {},
      modalOpen: false,
      editModalOpen: false,
    }
  } 
  
  async componentDidMount() {
    const response = await api.get('/foods');

    this.setState({ foods: response.data });
  }
  */

  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState({} as FoodType)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function loadData(){
      const response = await api.get('/foods');
      setFoods(response.data)
    }
    loadData()
  }, [])

  const handleAddFood = async (food:FoodType) => {
    // const { foods } = this.state;

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data])
      // this.setState({ foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  }

  const  handleUpdateFood = async (food:FoodType) => {
    // const { foods, editingFood } = this.state;

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      
      setFoods(foodsUpdated)

      // this.setState({ foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id:number) => {
    // const { foods } = this.state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
    // this.setState({ foods: foodsFiltered });
  }

  const toggleModal = () => {
    //const { modalOpen } = this.state;
    setModalOpen(!modalOpen)
    // this.setState({ modalOpen: !modalOpen });
  }

  const toggleEditModal = () => {
    // const { editModalOpen } = this.state;
    setEditModalOpen(!editModalOpen)
    // this.setState({ editModalOpen: !editModalOpen });
  }

  const handleEditFood = (food:FoodType) => {
    setEditingFood(food)
    setEditModalOpen(true)
    // this.setState({ editingFood: food, editModalOpen: true });
  }

  // const { modalOpen, editModalOpen, editingFood, foods } = this.state;

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              available={food.available}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
