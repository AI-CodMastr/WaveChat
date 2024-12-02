import {
    MenuOption,
} from 'react-native-popup-menu';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { View, Text } from 'react-native';

export const MenueItems = ({text, action, value, icon}) => {
    return (
        <MenuOption onSelect={()=> action(value)}>
           <View className='flex-row justify-between px-4 py-2 items-center'>
            <Text style={{fontSize: hp(2.2)}} className="font-semibold text-neutral-600 ">{text}</Text>
            <Text>{icon}</Text>
           </View>
        </MenuOption>
    )
}