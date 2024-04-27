
import numpy as np
import sys
import json


class Schedule(object):
    def __init__(self, nurse, day = 31, maxShift = 0,minShift = 0,minShiftDay = 0, minShiftMonth = 0, mixShiftMonth = 0):
        ''' กำหนด constructor ของการสร้างตาราง '''
        #เก็บข้อมูลพยาบาล
        self._nurse = nurse
        #จำนวนวันที่ต้องการสร้าง
        self._day = day
        #กำหนดความยาวของยีน
        self.geneLen = day * 3
        #เก็บข้อมูลสมาชิกเเละตาราง
        self._nuresSchedule = {}
        #จำนวนขั้นต่ำของจำนวนคนขึ้นผลัด ในแต่ละวัน
        self._minShiftDay = minShiftDay
        #จำนวนผลัดอย่างน้อยที่ ต้องขึ้นใน แต่ละเดือน
        self._minShiftMonth = minShiftMonth
        #จำนวนผลัดอย่างมากที่สุดที่สามารถเข้ากลุ่มได้
        self._mixShiftMonth = mixShiftMonth
        #จำนวนผลัดทขั้นต่ำที่จะต้องขึ้น ในแต่ละผลัด
        self._minShift = minShift
        #จำนวนผลัดที่เยอะที่สุดที่สามารถขึ้นได้ ในหนึ่งคน ต่อหนึ่งวัน
        self._maxShift = maxShift
        #เอาไว้นับจำนวนขึ้นผลัดในแต่ละแบบ
        self._countTwoShift = 0
        self._countOneShift = 0
        self._countThreeShift = 0
        self._countZeroShift = 0

        self._countDay = 0
        self._menaShift = 0
        self._menaCount = 0
        #นับจำนวนผลัดที่ขึ้นเกิน เช้า บ่าย ดึก ที่ตั้งไว้
        self._countAllShift = 0
        self._minShifts = {'เช้า':1, 'บ่าย':1, 'ดึก':1}
        self._countM = 0
        

    def Population(self, size = 31):
        '''สุ่มค่า Population'''
        pop = np.random.randint(2, size = size)

        return pop

    def CreateShiftNures(self):
        ''' สร้างตาราง gen ของตารางพยาบาล '''
        for index, nures in enumerate(self._nurse):
            pop = self.Population(size=self.geneLen)
            self._nuresSchedule[nures] = pop
    
    def MinShift(self):
        ''' ฟังก์ชันสำหรับเช็คว่า ในหนึ่งวันนั้น มีคนเข้าผลัดกี่ ผลัด'''

        for _, nurse in enumerate(self._nuresSchedule):
            window = 3
            ind = 0

            for i in range(0, self._day):
                #print(f"day {i +1} nurse {nurse} shift {self._nuresSchedule[nurse][ind:window]}")
                
                #while np.sum(self._nuresSchedule[nurse][ind:window]) == self._maxShift or np.sum(self._nuresSchedule[nurse][ind:window]) < self._minShift:
                #if np.sum(self._nuresSchedule[nurse][ind:window]) == self._maxShift or np.sum(self._nuresSchedule[nurse][ind:window]) == self._minShift:
                if np.sum(self._nuresSchedule[nurse][ind:window]) > self._maxShift:

                    ''' เงื่อนไข case ในหนึ่งวันมีการขึ้นผลัดน้องกว่า ที่กำหนดไว้ ถ้าน้อยกว่าขั้นต่ำก็ว่าจะเช็คใหม่'''
                    #print(f"day {i +1} nurse {nurse} shift {self._nuresSchedule[nurse][ind:window]}")
                    #print(f'ก่อน {self._nuresSchedule[nurse][ind:window]} sum {np.sum(self._nuresSchedule[nurse][ind:window])}')
                    
                    # crossOver = []
                    # p1 = self.Population(size=3)
                    # p2 = self.Population(size=3)

                    # select = [p1, p2]
                    # crossOver = select[int(np.random.randint(2, size=1))]
                    #self._nuresSchedule[nurse][ind:window] = crossOver
                    self._nuresSchedule[nurse][ind:window] = self.Population(size=3)
                    #print(f'หลัง {nurse} {self._nuresSchedule[nurse][ind:window]} sum {np.sum(self._nuresSchedule[nurse][ind:window])}')
            
                window +=3
                ind +=3

    def minShiftDay(self):
        ''' ฟังก์ชันสำหรับเช็คว่า ในหนึ่งวันนั้น มีจำนวนผลัดครบตามจำนวนขั้นต่ำที่ตั้งไว้หรือไม่'''
        window = 3
        index = 0
        self._countDay = 0
        for i in range(self._day):
            #print('minShiftDay', f'Day {i+1}')
            for N, nurse in enumerate(self._nurse):
                #print(f'Day {i+1} Nurse {nurse} {index, window} shift {self._nuresSchedule[nurse][index:window]}')
                #print('CountDay', countDay)
                self._countDay += np.sum(self._nuresSchedule[nurse][index:window])
            
            #print('TEST',countDay ,self._minShiftDay)
            if self._countDay < self._minShiftDay:
                #print(f'Day {i+1} Nurse {nurse} {index, window} shift {self._nuresSchedule[nurse][index:window]}')
                self.MinShift()
                
            window +=3
            index +=3
    
    def MinShiftMonth(self):
        ''' ฟังก์ชันสำหรับเช็ค จำนวนผลัดขั้นต่ำของการทำงานแต่ละเดือน '''
        #count = 0
        self._countM = 0
        for N, nurse in enumerate(self._nurse):
            #rint(np.sum(self._nuresSchedule[nurse]))
            #print(nurse, np.sum(self._nuresSchedule[nurse]))
            if np.sum(self._nuresSchedule[nurse]) > self._mixShiftMonth:
                self._countM +=1

    def PrintSchedule(self):
        for ind, nurse in enumerate(self._nuresSchedule):
            print(f'{nurse}:{list(self._nuresSchedule[nurse])}')
    

    def CountShift(self):
        ''' ฟังก์ชันสำหรับนับจำนวนผลัดที่ขึ้นติดต่อกัน 3 ผลัดในหนึ่งวัน'''
        self._menaCount = 0
        self._countZeroShift = 0
        self._countOneShift = 0
        self._countTwoShift = 0
        self._countThreeShift = 0
        self._countAllShift = 0



        for n, nurse in enumerate(self._nurse):
            window = 3 
            index = 0
            
            for i in range(self._day):
                if np.sum(self._nuresSchedule[nurse][index:window]) == 0: self._countZeroShift +=1
                #นับจำนวนผลัดที่ขึ้นหนึ่งผลัดในหนึ่งวัน
                if np.sum(self._nuresSchedule[nurse][index:window]) == 1: self._countOneShift +=1
                #นับจำนวนผลัดที่ขึ้นสองผลัดในหนึ่งวัน
                if np.sum(self._nuresSchedule[nurse][index:window]) == 2: self._countTwoShift +=1
                #นับจำนวนผลัดที่ขึ้นสองผลัดในหนึ่งวัน
                if np.sum(self._nuresSchedule[nurse][index:window]) == 3: self._countThreeShift +=1
                #จำนวนผลัดที่ไม่ได้ขึ้นเลย


            window +=3 
            index +=3

        #นับว่ามีใครขึ้นน้อยกว่าค่าเฉลี่ยหรือไม่
        meanShift = []
        #ใช้เช็คค่าเฉลี่ย
        self._menaShift = 0
        for index, nurse in enumerate(self._nurse):
            meanShift.append( np.sum(self._nuresSchedule[nurse]) )
        
        meanGroup = int(np.sum(meanShift)/len(self._nurse))
        self._menaShift = round(meanGroup, 1)
    
        for index, nurse in enumerate(self._nurse):
            if np.sum(self._nuresSchedule[nurse]) < self._menaShift:
                self._menaCount +=1
            
        #นับว่าขึ้นครบอย่างน้อย morning noon night ตามจำนวนที่นับไว้หรือไม่

        window = 3
        index = 0

        for day in range(self._day):
            morning = 0
            noon = 0
            night = 0

            for  _, nurse in enumerate(self._nurse):
                #print(i)
                shift = self._nuresSchedule[nurse][index:window]
                #print(f'Day {day+1} Nures {nurse} {index} --> {window}')
                morning += shift[0]
                noon += shift[1]
                night += shift[2]

            #print(morning, noon, night)
            if morning < self._minShifts['เช้า'] or noon < self._minShifts['บ่าย'] or night < self._minShifts['ดึก']:
                #print(f'day {day+1}:',morning, noon, night)
                self._countAllShift +=1
        
            window += 3
            index += 3


        # for _, nurse in enumerate(self._nurse):
        #     if np.sum(self._nuresSchedule[nurse]) > self._minShiftMonth:
        #         self._countM +=1

    def CountDay(self):
        '''นับจำนวนผลัดที่ขึ้นเกินกำของหนึ่งวัน'''
        window = 3
        index = 0

        for i in range(self._day):
        
            countDay = 0
            self._countDay = 0
            for N, nurse in enumerate(self._nurse):
                #print(f'Day {i+1} Nurse {nurse} {index, window} shift {self._nuresSchedule[nurse][index:window]}')
                countDay += np.sum(self._nuresSchedule[nurse][index:window])

            #print(f'Day {i+1} count Day {countDay}')
            #self._minShiftDay ตัวแปรไว้เช็คว่ามีการขึ้นผลัดรวมของหนึ่งวันเท่าไหร่
            if countDay < self._minShiftDay:
                #print(f'Day {i+1} Nurse {nurse} {index, window} shift {self._nuresSchedule[nurse][index:window]}')
                self._countDay +=1

        
            window +=3
            index +=3
            
    def limitShift(self):
        ''' กำหนด เช้า บ่าย ดึก ทั้งหมด ต้องขึ้นอย่างน้อยกี่ผลัด '''
        window = 3
        index = 0
                
        for day in range(self._day):
            morning = 0
            noon = 0
            night = 0
            for  _, nurse in enumerate(self._nurse):
                #print(i)
                shift = self._nuresSchedule[nurse][index:window]
                #print(f'Day {day+1} Nures {nurse} {index} --> {window}')
                #print('shift slot',shift[0], shift[1], shift[2])
                morning += shift[0]
                noon += shift[1]
                night += shift[2]


            #print(f' day {day +1 } morning {morning} noon {noon} night {night}')
            # นับจำนวนผลัดรวมของหนึ่งวัน
            
            if morning < self._minShifts['เช้า'] or noon < self._minShifts['บ่าย'] or night < self._minShifts['ดึก']:
                sumShift = 0
                #เช็คค่าที่ส่มมาว่า จะเกิน ขั้นต่ำในแต่ละวันหรือไหม
                while sumShift < self._minShiftDay:
                    for i, nurse in enumerate(self._nurse):
                        self._nuresSchedule[nurse][index:window] = self.Population(size=3)
                        sumShift += np.sum(self._nuresSchedule[nurse][index:window]) 

                #print(f' day {day +1 } morning {morning} noon {noon} night {night}')
                #เช็คผลัดรวม หนึ่งวัน น้อยกว่ากำหนดมหรือไม่
                #print(f' day {day +1 } morning {morning} noon {noon} night {night}')
            #พวกเพิ่มเพื่อน slice ไปยังวันถัดไป
            window += 3
            index += 3

    def Run(self):
        ''' Main '''
        #start = time.time()
        #epoch = 0
        self.CreateShiftNures()
        self.CountShift()
        #CountM = self.MinShiftMonth()
        self.MinShiftMonth()
        while self._countAllShift > 0 or self._countM:
            #print(f'Epoch = {epoch} CountAllShift {self._countAllShift} {self._countM}')
            #อัพเดตข้อมูลตาราง เช้า บ่าย ดึก
            self.limitShift()
            #จำนวนผลัดที่ ในหนึ่งวัน ว่ามีการขึ้นผลัดแบบ 0 หรือไม่และ ต่ำสุดคือ 1 หรือไม่สุดท้าย ไม่มีสามผลัดอยู่ในนั้นหรือไม่
            self.MinShift()
            #ปรับตารางหาก มีสมาชิกทำงานเกินค่าเฉลี่ย
            #self.MeanMonth()
            #นับผลรวม
            self.CountShift()
            self.MinShiftMonth()

            #self.CountDay()

            #epoch +=1

        self.PrintSchedule()

        # print('\n')
        # print('จำนวนที่ใช้ในการ Population',epoch,'ครั้ง')
        # print(f'เวลาที่ใช้ในการจัดตารางขึ้นเวร {int(time.time() - start) / 60} นาที')

def main():
    nurse = sys.argv[1].split(",")
    option = json.loads(sys.argv[2])
    #init
    schedule = Schedule(nurse=nurse,
        day = int(option["day"]),
        maxShift=int(option["maxShift"]),
        minShift=int(option["minShift"]), 
        minShiftDay=int(option["minShiftDay"]), 
        minShiftMonth =int(option["minShiftMonth"]),
        mixShiftMonth = 40)

    #schedule.CreateShiftNures()
    schedule.Run()


    #print('จำนวนผลัดที่ขึ้นหนึ่งผลัด', schedule._countOneShift)
    #print('จำนวนผลัดที่ขึ้นสองผลัด', schedule._countTwoShift)
    #print('จำนวนผลัดที่ขึ้นสามผลัด', schedule._countThreeShift)
    #print('จำนวนผลัดที่ขึ้นเกินจำนวนวันที่กำหนด', schedule._countDay)

if __name__ == "__main__":
    main()