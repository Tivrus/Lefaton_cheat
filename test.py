def maths(value):
    p = 2 * value
    v = (50*p + 10*value)/value
    v = round(value/v)
    p = 50*v
    u = p*3
    print(f'{v} - Получится взрывчатого вещества')
    print(f'{p} - Затратится пороха')
    print(f'{v*3} - Затратится ТНК')
    print(f'{u} - Затратится угля')
    print(f'{v*10} - Затратится фрагментов металла')



sera_value = input('Введите колличество серы:\n') 
maths(int(sera_value))
