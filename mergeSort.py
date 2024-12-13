def mergeSort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    leftHalf = arr[:mid] # leftHalf gets arr from 0 to mid
    rightHalf = arr[mid:] # rightHalf gets arr from mid to end

    sortedLeft = mergeSort(leftHalf) # continue to split arr into pieces
    sortedRight = mergeSort(rightHalf) 

    return merge(sortedLeft, sortedRight) # merge arr based on conditions

def merge(left, right): 
    result = []
    i = j = 0 # iteration variables for left and right

    while i < len(left) and j < len(right): # iterate through both halves
        if left[i] < right[j]: 
            result.append(left[i]) 
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:]) # add the rest of the arrays to result
    result.extend(right[j:])

    return result

def main():
    array1 = [10, 8, 32, 25, 1, 92, 40, 51, 7]
    print(array1)
    print(mergeSort(array1))

if __name__ == '__main__':
    main()