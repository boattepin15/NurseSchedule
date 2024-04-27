import numpy as np


class Schedule(object):
    def __init__(self, nurse, day):
        ''' กำหนด constructor ของการสร้างตาราง '''
        #เก็บข้อมูลพยาบาล
        self._nurse = nurse
        #จำนวนวันที่ต้องการสร้าง
        self._day = day
        #กำหนดความยาวของยีน
        self._geneLen = day * 3
        #เก็บข้อมูลสมาชิกเเละตาราง
        self._nuresSchedule = {}
        self._shiftWeek = {}
        #เก็บข้อมูล sum ของการทำงานเเต่ละสัปดาห์
        self._countWeek = {}
        #นับจำนวนผลัดที่ขึ้นติดต่อกัน
        self.countConsecutive = 0
        self._shiftFrame = None
        self._week = 4


    def Population(self, size):
        '''สุ่มค่า Population'''
        pop = np.random.randint(2, size = self._geneLen)

        return pop

    def ScheduleNures(self):
        ''' สร้างตารางตารางขึ้นเวร จากค่า Population '''

        for index, nurse in enumerate(self._nurse):
            self._nuresSchedule[nurse] = {
                "shiftWeek(1)":self.Population(size = self._day),
                "shiftWeek(2)":self.Population(size = self._day),
                "shiftWeek(3)":self.Population(size = self._day),
                "shiftWeek(4)":self.Population(size = self._day),
            }


        self.CountWeek()

    def PrintSchedule(self):
        ''' เเสดงค่าผลต่าง ๆ หลังจากกันจัดเรียงข้อมูลทั้งหมด'''
        print('ตารางขึ้นเวร')
        for ind, nurse in enumerate(self._nuresSchedule):
            for i in range(self._week):
                print(f'{nurse} {self._nuresSchedule[nurse][f"shiftWeek({i+1})"]}')

        print("จำนวนรวมของการขึ้นผลัดในเเต่ละสัปดาห์")
        for index, nurse in enumerate(self._countWeek):
            for i in range(self._week):
                print(f'{nurse} {self._countWeek[nurse][f"countWeek({i+1})"]}')



    def CountWeek(self):
        ''' สร้างเก็บข้อมููลการทำงานรวมในเเต่ละสัปดาห์'''
        shiftWeek = 1
        for index, nures in enumerate(self._nuresSchedule):
            self._countWeek[nures] = {
                "countWeek(1)":sum(self._nuresSchedule[nures][f"shiftWeek({shiftWeek})"]),
                "countWeek(2)":sum(self._nuresSchedule[nures][f"shiftWeek({shiftWeek + 1})"]),
                "countWeek(3)":sum(self._nuresSchedule[nures][f"shiftWeek({shiftWeek +2})"]),
                "countWeek(4)":sum(self._nuresSchedule[nures][f"shiftWeek({shiftWeek +3})"])
            }


    def SplitDay(self):
        ''' เเบ่งข้อมูลผลัดออกมาเป็นวัน [1, 1, 1] '''
        for i, N in enumerate(self._nuresSchedule):

            for shiftWeek in range(0 ,self._week):
                window = 3
                index = 0
                for i in range(0, self._day):
                    #print(N, self._nuresSchedule[N][f"shiftWeek({shiftWeek +1})"][index:window])
                    self.ConsecutivePart(nurse = N,
                                        shift = self._nuresSchedule[N][f"shiftWeek({shiftWeek +1})"][index:window],
                                        week = f"shiftWeek({shiftWeek +1})",
                                        index = index,
                                        window = window)

                    index +=3
                    window +=3



    def CountConsecutive(self, nures ,shift):
        shift = str(shift).strip("[, ]")
        if shift == '1 1 1' or shift == '0 1 1' or shift == '1 1 0':
            self.countConsecutive +=1

    def countShiftPerAllViolations(self):
        violations = 0
        weekShiftList = []

        for index, nures in enumerate(self._nuresSchedule):
            weekShiftList.append(f'{nures} : {sum(self._nuresSchedule[nures])}')

        return weekShiftList


class ContsTraint(Schedule):
    ''' คลาสนี้จะทำการสร้าง กฎต่างๆหรือ ContsTrint เเล้วทำการปรับข้อมูลตาราง'''
    def __init__(self, nurse, day):
        super().__init__(nurse, day)
        Schedule.__init__(self, nurse, day)

    def ShiftLimit(self):
        ''' หนึ่งคนในหนึ่งสัปดาห์ต้องเข้าผลัดไม่เกิน 6 ผลัด ถ้าเกินให้สุ่มค่า Population ใหม่จนกว่าจะไม่เกิน'''

        for index, nurse in enumerate(self._countWeek):
            for i in range(self._week):
                while self._countWeek[nurse][f'countWeek({i+1})'] > 5:
                    pop = self.Population(size = 7)
                    self._nuresSchedule[nurse][f"shiftWeek({i+1})"] = pop
                    self.CountWeek()



    def ConsecutivePart(self, nurse, shift,week, index, window):
        '''หนึ่งวันต้องไม่มีการขึ้น 3 ผลัดในหนึ่งวัน เเล้วไม่มีมีการขึ้นผลัดบ่ายควบกับผลัดดึก ถ้าหากมี ก็ให้สุ่มข้อมูลผลัดใหม่จาก ที่กำหนดไว้'''
        shiftDream = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 0],
        [1, 0, 1],
        [0, 0, 0]

        ]

        shift = str(shift).strip("[, ]")

        if shift == "1 1 1" or shift == "0 1 1":
            newShift =  np.random.randint(len(shiftDream), size = 1)
            self._nuresSchedule[nurse][week][index:window] = shiftDream[newShift[0]]

    def LastDay(self):
        """ วันขึ้นวันใหม่กับวันสุดท้ายของสัปดาห์"""

        for index, nurse in enumerate(self._nuresSchedule):
            countWeek = 1
            shiftDream = [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
                [1, 0, 1],
                [0, 0, 0]
            ]
            for i in range(self._week):
                oldWeek = self._nuresSchedule[nurse][f'shiftWeek({countWeek})'][18:]
                newWeek = self._nuresSchedule[nurse][f'shiftWeek({countWeek +1})'][:3]

                newWeek = str(newWeek).strip("[, ]")
                oldWeek = str(oldWeek).strip("[, ]")

                if oldWeek == "0 0 1" and newWeek == "1 1 0":
                    newShifts =  np.random.randint(len(shiftDream), size = 1)
                    self._nuresSchedule[nurse][f'shiftWeek({countWeek +1})'][:3] = shiftDream[newShifts[0]]

                if oldWeek == "1 0 1" and newWeek == "1 1 0":
                    newShifts =  np.random.randint(len(shiftDream), size = 1)
                    self._nuresSchedule[nurse][f'shiftWeek({countWeek +1})'][:3] = shiftDream[newShifts[0]]

                countWeek +=1
                if countWeek >3 :
                    break


class SolutionCase(ContsTraint):
    """ class นี้เอาจัดการเรื่องของ case ต่าง ๆ ที่สร้างขึ้นมา"""
    def __init__(self, nurse, day):
        super().__init__(nurse, day)
        ContsTraint.__init__(self, nurse, day)

        self.countCase = 0

    def TestCase(self):
        """ เอาไว้รันในเเต่ละ case ที่เราสร้างขึ้นมา"""
        case = {
            "1":self.ScheduleNures(),
            "2":self.ShiftLimit(),
            "3":self.SplitDay(),
            "4":self.LastDay()
        }

        for i in case:
            try:
                case[f'{i}']
            except:
                print("เกิดขึ้นผิดพลาดบางอย่างใน TestCase")

        """ รันครบทุก case เเล้วใหัทำการเเสดงผลออกมา """
        self.PrintSchedule()



def main():

    Schedules = SolutionCase(nurse = ["A", "C", "D"], day = 7)
    Schedules.TestCase()

if __name__ == "__main__":
    main()
